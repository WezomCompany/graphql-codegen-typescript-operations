import type { AddPluginConfig } from '@graphql-codegen/add/typings/config';
import type { CodegenConfig } from '@graphql-codegen/cli';
import type { Types } from '@graphql-codegen/plugin-helpers';
import {
	SplitEnumsPatcher,
	Options as SplitEnumsPatcherOptions,
} from './SplitEnumsPatcher';

export class SplitEnumsConfigurator {
	protected readonly outputDir: string;
	protected readonly codegenConfig: BaseCodegenConfig;
	protected readonly patcher: SplitEnumsPatcher;
	protected readonly pluginConfig: Types.PluginConfig;
	protected readonly addContent: AddPluginConfig[];

	constructor(options: Options) {
		const {
			outputDir,
			pluginConfig,
			patcherConfig = {},
			addContent,
			...codegenConfig
		} = options;
		this.outputDir = outputDir;
		this.codegenConfig = codegenConfig;
		this.patcher = new SplitEnumsPatcher({ outputDir, ...patcherConfig });
		this.pluginConfig = pluginConfig || {};
		this.addContent = addContent || [];
	}

	protected getPluginForOperations(): Types.ConfiguredPlugin {
		return {
			plugins: [
				'graphql-codegen-typescript-operation-types',
				'typescript-operations',
				...this.addContent.map((content) => ({ add: content })),
			],
			config: {
				declarationKind: 'interface',
				onlyOperationTypes: true,
				omitObjectTypes: true,
				preResolveTypes: true,
				...this.pluginConfig,
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
	patcherConfig?: Omit<SplitEnumsPatcherOptions, 'outputDir'>;
	pluginConfig?: Types.PluginConfig;
	addContent?: AddPluginConfig[];
}
