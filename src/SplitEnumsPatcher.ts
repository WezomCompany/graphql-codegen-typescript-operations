import fs from 'node:fs';

export class SplitEnumsPatcher {
	protected readonly outputDir: string;
	protected readonly enums: string = 'enums';
	protected readonly operations: string = 'operations';

	constructor(options: Options) {
		this.outputDir = options.outputDir;
		this.afterAllFileWriteHook = this.afterAllFileWriteHook.bind(this);
	}

	getFilePaths(): Record<'operations' | 'enums' | 'index', string> {
		const path = (file: string): string => `${this.outputDir}/${file}.ts`;
		return {
			operations: path(this.operations),
			enums: path(this.enums),
			index: path('index'),
		};
	}

	afterAllFileWriteHook(): void {
		this.writeIndexFile();
		this.rewriteEnumFile();
		this.rewriteOperationFile();
	}

	protected writeIndexFile(): void {
		const { index } = this.getFilePaths();
		const content = [
			this.exports('*', this.enums),
			this.exports('*', this.operations),
		].join('');
		fs.writeFileSync(index, content, 'utf-8');
	}

	// todo implement
	protected rewriteOperationFile(): void {
		const { operations } = this.getFilePaths();
		const content = fs.readFileSync(operations, 'utf-8');
		console.log('rewriteOperationFile', operations, content);
	}

	protected rewriteEnumFile(): void {
		const { enums: enumsFile } = this.getFilePaths();
		const content = fs.readFileSync(enumsFile, 'utf-8');
		const enums =
			this.getEnums(content)
				.map(({ source }) => source)
				.join('\n\n') + '\n';

		fs.writeFileSync(enumsFile, enums, 'utf-8');
	}

	protected getEnums(content: string): Enum[] {
		const enums: Enum[] = [];
		const regExp =
			/(((\/\/.+\r?\n)+)?export enum (\w+) ((.|\r?\n)(?!\r?\n\s*}))+.\r?\n\s*})/gm;

		let match = regExp.exec(content);
		while (match !== null) {
			const [source = '', , , , name] = match || [];
			enums.push({ name, source });
			match = regExp.exec(content);
		}

		return enums
			.filter(({ source }) => source.length > 0)
			.sort((a, b) => a.name.localeCompare(b.name));
	}

	protected exports(entity: string, file: string): string {
		return `export ${entity} from './${file}';\n`;
	}
}

interface Options {
	outputDir: string;
}

interface Enum {
	name: string;
	source: string;
}
