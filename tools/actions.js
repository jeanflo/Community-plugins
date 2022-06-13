import * as helpers from "./helpers.js";
import nunjucks from "nunjucks";
import fs from 'fs';
import {get_plugins_in_categories, read_dist_plugins} from './helpers.js';

export const run_update = async (metadata_files, force = false) => {
    for (const [filepath, id, filename] of metadata_files) {
        console.log(`Checking ${id}/${filename}`);
        const metadata = helpers.read_metadata_file(filepath);

        if (force || await helpers.is_plugin_update_available(metadata, id, filename)) {
            console.log(`Updating ${id}/${filename}`);
            await helpers.update_plugin(metadata, id, filename);
        } else {
            console.log(`${id}/${filename} is up to date`);
        }
    }
}

export const make_plugins_list = () => {
    const template = fs.readFileSync("templates/README.njk", 'utf8');
    const plugins = read_dist_plugins();
    const plugins_in_categories = get_plugins_in_categories(plugins);
    console.log(plugins_in_categories);

    nunjucks.configure({ autoescape: true });
    const readme = nunjucks.renderString(template, { store: plugins_in_categories });

    fs.writeFileSync("../README.md", readme);
    console.log("README.md updated");
}