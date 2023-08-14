import { SplitEnumsConfigurator } from '../lib/index.mjs';

const configurator = new SplitEnumsConfigurator({
	schema: 'playground/schema.graphql',
	documents: 'playground/operation.graphql',
	outputDir: 'playground/__generated__',
});

export default configurator.create();
