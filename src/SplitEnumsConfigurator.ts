import type { CodegenConfig } from '@graphql-codegen/cli';
import type { Types } from '@graphql-codegen/plugin-helpers';

export class SplitEnumsConfigurator {
	protected readonly outputDir: string;
	protected readonly codegenConfig: BaseCodegenConfig;

	constructor(options: Options) {
		const { outputDir, ...codegeConfig } = options;
		this.outputDir = outputDir;
		this.codegenConfig = codegeConfig;
	}

	protected getPluginForOperations(): Types.ConfiguredPlugin {
		return {
			plugins: ['typescript', 'typescript-operations'],
			config: {
				onlyOperationTypes: true,
			},
		};
	}

	protected getPluginForEnums(): Types.ConfiguredPlugin {
		return {
			plugins: ['typescript', 'typescript-operations'],
			config: {
				onlyEnums: true,
			},
		};
	}

	create(): CodegenConfig {
		const fileWithOperations = `${this.outputDir}/operations.ts`;
		const fileWithEnums = `${this.outputDir}/enums.ts`;
		return {
			...this.codegenConfig,
			generates: {
				[fileWithOperations]: this.getPluginForOperations(),
				[fileWithEnums]: this.getPluginForEnums(),
			},
		};
	}
}

type BaseCodegenConfig = Omit<CodegenConfig, 'generates'>;
interface Options extends BaseCodegenConfig {
	outputDir: string;
}
