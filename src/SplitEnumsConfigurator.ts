import type { CodegenConfig } from '@graphql-codegen/cli';
import type { Types } from '@graphql-codegen/plugin-helpers';
import { SplitEnumsPatcher } from './SplitEnumsPatcher';

export class SplitEnumsConfigurator {
	protected readonly outputDir: string;
	protected readonly codegenConfig: BaseCodegenConfig;
	protected readonly patcher: SplitEnumsPatcher;

	constructor(options: Options) {
		const { outputDir, ...codegeConfig } = options;
		this.outputDir = outputDir;
		this.codegenConfig = codegeConfig;
		this.patcher = new SplitEnumsPatcher({ outputDir });
	}

	protected getPluginForOperations(): Types.ConfiguredPlugin {
		return {
			plugins: ['typescript', 'typescript-operations'],
			config: {
				declarationKind: 'interface',
				onlyOperationTypes: true,
			},
		};
	}

	protected getHooks(): Types.ConfiguredPlugin['hooks'] {
		const hooks = this.codegenConfig.hooks || {};
		const afterAllFileWriteHooks: (string | Types.HookFunction)[] = [
			this.patcher.afterAllFileWriteHook,
		];

		if (Array.isArray(hooks.afterAllFileWrite)) {
			afterAllFileWriteHooks.push(...hooks.afterAllFileWrite);
		}

		return {
			...hooks,
			afterAllFileWrite: afterAllFileWriteHooks,
		};
	}

	create(): CodegenConfig {
		const { operations: fileWithOperations } = this.patcher.getFilePaths();

		return {
			...this.codegenConfig,
			hooks: this.getHooks(),
			generates: {
				[fileWithOperations]: this.getPluginForOperations(),
			},
		};
	}
}

type BaseCodegenConfig = Omit<CodegenConfig, 'generates'>;
interface Options extends BaseCodegenConfig {
	outputDir: string;
}
