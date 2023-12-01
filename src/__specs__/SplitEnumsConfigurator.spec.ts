import { describe, expect, it } from 'vitest';
import { SplitEnumsConfigurator } from '../index';

describe('SplitEnumsConfigurator', () => {
	it('should create codegen configuration', () => {
		const configurator = new SplitEnumsConfigurator({
			schema: 'schema.graphql',
			outputDir: 'output',
		});

		const config = configurator.create();

		expect(config).toEqual(
			expect.objectContaining({
				schema: 'schema.graphql',
				generates: {
					'output/operations.ts': {
						plugins: [
							'graphql-codegen-typescript-operation-types',
							'typescript-operations',
						],
						config: {
							declarationKind: 'interface',
							onlyOperationTypes: true,
							omitObjectTypes: true,
							preResolveTypes: true,
						},
					},
				},
			})
		);
	});

	it('should create codegen configuration with additional content', () => {
		const configurator = new SplitEnumsConfigurator({
			schema: 'schema.graphql',
			outputDir: 'output',
			addContent: [
				{
					content: 'content 1',
				},
				{
					content: 'content 2',
					placement: 'append',
				},
			],
			pluginConfig: {
				option1: 'test',
				option2: true,
				option3: { test: 2 },
			},
		});

		const config = configurator.create();

		expect(config).toEqual(
			expect.objectContaining({
				schema: 'schema.graphql',
				generates: {
					'output/operations.ts': {
						plugins: [
							'graphql-codegen-typescript-operation-types',
							'typescript-operations',
							{
								add: { content: 'content 1' },
							},
							{
								add: {
									content: 'content 2',
									placement: 'append',
								},
							},
						],
						config: {
							declarationKind: 'interface',
							onlyOperationTypes: true,
							omitObjectTypes: true,
							preResolveTypes: true,
							option1: 'test',
							option2: true,
							option3: { test: 2 },
						},
					},
				},
			})
		);
	});

	it('should set default `afterAllFileWrite` hook', () => {
		const configurator = new SplitEnumsConfigurator({
			outputDir: 'output',
			hooks: {
				afterAllFileWrite: ['some-hook'],
			},
		});

		const config = configurator.create();
		const afterAllFileWriteHooks = config.hooks?.afterAllFileWrite || [];
		expect(afterAllFileWriteHooks).toHaveLength(2);
		// @ts-ignore
		expect(typeof afterAllFileWriteHooks[0]).toEqual('function');
	});
});
