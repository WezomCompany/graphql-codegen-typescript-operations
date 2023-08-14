export class SplitEnumsPatcher {
	protected readonly outputDir: string;
	protected readonly enums: string = 'enums';
	protected readonly operations: string = 'operations';

	constructor(options: Options) {
		this.outputDir = options.outputDir;
	}

	getFilePaths(): Record<'operations' | 'enums' | 'index', string> {
		const path = (file: string): string => `${this.outputDir}/${file}.ts`;
		return {
			operations: path(this.operations),
			enums: path(this.enums),
			index: path('index'),
		};
	}

	protected exports(entity: string, file: string): string {
		return `export ${entity} from './${file}';\n`;
	}

	protected writeIndexFile(): void {
		const { index } = this.getFilePaths();
		const content = [
			this.exports('*', this.enums),
			this.exports('*', this.operations),
		];
		console.log('writeIndexFile', index, content);
	}
}

interface Options {
	outputDir: string;
}
