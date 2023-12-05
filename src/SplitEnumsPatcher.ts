import fs from 'node:fs';

export class SplitEnumsPatcher {
	protected readonly outputDir: string;
	protected readonly enums: string = 'enums';
	protected readonly operations: string;
	protected readonly noRootIndexFile: boolean;
	protected readonly splitEnums: boolean;

	constructor(options: Options) {
		this.outputDir = options.outputDir;
		this.operations = options.fileNameForTypes || 'operations';
		this.noRootIndexFile = options.noRootIndexFile || false;
		this.splitEnums = options.splitEnums || false;
		this.afterAllFileWriteHook = this.afterAllFileWriteHook.bind(this);
	}

	protected getPath(name: string, path?: string, isFile = true): string {
		const output = this.outputDir.replace(/(\/)+$/, '');

		const _path = path ? `/${path.replace(/(\/)+$/, '')}` : '';

		return `${output + _path}/${name}${isFile ? '.ts' : ''}`;
	}

	getFilePaths(): Record<'operations' | 'enums' | 'index', string> {
		return {
			operations: this.getPath(this.operations),
			enums: this.getPath(this.enums),
			index: this.getPath('index'),
		};
	}

	afterAllFileWriteHook(): void {
		const {
			operations: operationsFile,
			enums: enumsFile,
			index: indexFile,
		} = this.getFilePaths();
		const content = this.readOperationsFile(operationsFile);
		const enums = this.getEnums(content);

		!this.noRootIndexFile && this.writeIndexFile(indexFile);
		if (this.splitEnums) {
			this.writeEnumsDirectory(enums);
		} else {
			this.writeEnumsFile(enumsFile, enums);
		}
		this.rewriteOperationsFile(operationsFile, content, enums);
	}

	protected readOperationsFile(filename: string): string {
		return fs.readFileSync(filename, 'utf-8');
	}

	protected writeIndexFile(filename: string): void {
		const content = [
			this.exports('*', this.enums),
			this.exports('*', this.operations),
		].join('');
		fs.writeFileSync(filename, content, 'utf-8');
	}

	protected writeEnumsFile(filename: string, enums: Enum[]): void {
		const content =
			enums.length > 0
				? enums.map(({ source }) => source).join('\n\n')
				: 'export {};';
		fs.writeFileSync(filename, content + '\n', 'utf-8');
	}

	protected writeEnumsDirectory(enums: Enum[]): void {
		try {
			const enumsDir = this.getPath(this.enums, undefined, false);

			if (fs.existsSync(enumsDir)) {
				fs.rmdirSync(enumsDir, { recursive: true });
			}

			fs.mkdirSync(enumsDir);

			enums.forEach(({ name, source }) => {
				fs.writeFileSync(
					this.getPath(name, this.enums),
					source,
					'utf-8'
				);
			});

			fs.writeFileSync(
				this.getPath('index', this.enums),
				enums.length
					? enums
							.map(({ name }) => `export * from './${name}';`)
							.join('\n')
					: 'export {};',
				'utf-8'
			);
		} catch (e) {
			console.log(e);
		}
	}

	protected rewriteOperationsFile(
		filename: string,
		content: string,
		enums: Enum[]
	): void {
		const enumsImports: string[] = enums.map(({ name }) => name);
		enums.forEach(({ name, source }) => {
			content = content.replace(source, '');
		});

		const imports =
			enumsImports.length === 0
				? ''
				: `import type { ${enumsImports.join(', ')} } from './${
						this.enums
				  }';\n\n`;

		fs.writeFileSync(filename, imports + content, 'utf-8');
	}

	protected getEnums(content: string): Enum[] {
		const enums: Enum[] = [];
		const regExp =
			/(((\/\/.+\r?\n)+)?export enum (\w+) ((.|\r?\n)(?!\r?\n\s*}))+.\r?\n\s*})/gm;

		let match = regExp.exec(content);
		while (match !== null) {
			const [source, , , , name] = match;
			enums.push({ name, source });
			match = regExp.exec(content);
		}

		return enums.sort((a, b) => a.name.localeCompare(b.name));
	}

	protected exports(entity: string, file: string): string {
		return `export ${entity} from './${file}';\n`;
	}
}

export interface Options {
	outputDir: string;
	fileNameForTypes?: string;
	noRootIndexFile?: boolean;
	splitEnums?: boolean;
}

interface Enum {
	name: string;
	source: string;
}
