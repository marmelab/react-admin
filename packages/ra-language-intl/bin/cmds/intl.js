exports.command = 'intl <command>';
exports.desc = 'Manage intl configuration (only available in intl declination)';
exports.builder = (yargs) => yargs.commandDir('intl_cmds');
