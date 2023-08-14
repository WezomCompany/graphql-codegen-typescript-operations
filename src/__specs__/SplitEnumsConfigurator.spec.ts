import { describe, expect, it } from 'vitest';
import { SplitEnumsConfigurator } from '../index';

describe('CodegenConfigCreator', () => {
	it('should create codegen configuration', () => {
		const configurator = new SplitEnumsConfigurator({
			schema: 'schema.graphql',
			outputDir: 'output',
		});

		const config = configurator.create();

		expect(config).toEqual({
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
		});
	});
});
