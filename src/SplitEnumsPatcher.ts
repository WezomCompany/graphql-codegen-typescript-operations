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

	// todo implement
	protected rewriteEnumFile(): void {
		const { enums } = this.getFilePaths();
		const content = fs.readFileSync(enums, 'utf-8');
		console.log('rewriteEnumFile', enums, content);
	}

	protected exports(entity: string, file: string): string {
		return `export ${entity} from './${file}';\n`;
	}
}

interface Options {
	outputDir: string;
}
