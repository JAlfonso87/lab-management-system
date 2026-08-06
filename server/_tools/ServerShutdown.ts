import chalk from 'chalk';
import { DockerManager } from './DockerManager.js'

export class ServerShutdown{
    async stopServices(mode:number) {
        const dockerManager = new DockerManager();  
        try {
            if (mode == 0)
                console.log(chalk.green("< SISTEMA >: COMENZANDO APAGADO DEL SISTEMA..."))
            else if (mode == 1)
                console.log(chalk.yellow("< SISTEMA >: SE PRODUJO UN ERROR FATAL, COMENZANDO APAGADO ALTERNATIVO DEL SISTEMA."))

            await dockerManager.stop();

            console.log(chalk.green("< SISTEMA >: TODOS LOS PROCESOS HAN SIDO FINALIZADOS."))
            process.exit(mode == 0 ? 0 : 1)
        }
        catch(error) {
            console.log(chalk.red("< SISTEMA >: EL SISTEMA SE HA CERRADO DE FORMA INESPERADA CON EL SIGUIENTE ERROR: "+ error))
            process.exit(1)
        }
        
    }
}
