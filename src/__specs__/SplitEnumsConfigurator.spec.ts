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
						plugins: ['typescript', 'typescript-operations'],
						config: {
							onlyOperationTypes: true,
						},
					},
					'output/enums.ts': {
						plugins: ['typescript', 'typescript-operations'],
						config: {
							onlyEnums: true,
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
