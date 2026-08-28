import { ChildProcess, spawn } from 'node:child_process';
import chalk from 'chalk';
import { ServerShutdown } from './ServerShutdown.js';

export class NestManager{

    private nest?:ChildProcess;

    async start(): Promise<void>{
        return new Promise<void>(() => {
            console.log(chalk.magenta("< NESTJS >: INICIANDO SERVIDOR WEB EN EL PUERTO: " + process.env.NESTJS_SERVER_PORT) + chalk.magenta("..."))
            this.nest = spawn('cmd.exe', ['/c', 'pnpm', 'nest', 'start'], {
                stdio: 'inherit',
            })
            
            this.nest.on('error', (error) => {
                console.error(chalk.red("< NESTJS >: SE HA PRODUCIDO UN ERROR DURANTE LA INICIALIZACIÓN DEL SERVIDOR WEB: " + error))
                console.error(chalk.red("< NESTJS >: EL SERVIDOR WEB SE HA DETENIDO DE FORMA INESPERADA."))
                new ServerShutdown(1)
            })

            process.on('SIGINT', () => {
                console.log(chalk.magenta("< NESTJS >: EL SERVIDOR WEB SE HA DETENIDO CORRECTAMENTE."))
                new ServerShutdown();
            });

        })
    }
}