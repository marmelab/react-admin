import execa from 'execa';
import { useStderr, useStdout } from 'ink';
import { ProjectConfiguration } from './ProjectState';

export const useInstallDeps = () => {
    const { stdout } = useStdout();
    const { stderr } = useStderr();

    return async (state: ProjectConfiguration) => {
        const command = execa(`${state.installer}`, ['install'], {
            cwd: `./${state.name}`,
        });
        command.stdout.pipe(stdout);
        command.stderr.pipe(stderr);

        await command;
    };
};
