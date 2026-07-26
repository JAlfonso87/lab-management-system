import { spawn } from 'node:child_process';
import chalk from 'chalk';

export class DockerManager {
    async sleep(ms:number): Promise<void> {
        return new Promise<void>((resolve) => setTimeout(resolve, ms))
    }
    

    async start(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(chalk.blue("< DOCKER >: INICIALIZANDO CONTENEDOR..."))
            const docker = spawn('docker', ['compose','up','-d'], {
                stdio: 'inherit'
            })

            docker.on('error', (error) =>{
                console.error(chalk.blue("< DOCKER >: SE HA PRODUCIDO UN ERROR EN LA INICIALIZACIÓN DEL CONTENEDOR:" + error.message))
                spawn('docker', ['compose', 'down', '-v'], {
                    stdio: 'inherit'
                })
            })

            docker.on('close', (code) => {
                if(code == 0)
                    return resolve()
                else
                    return reject()
            })
        }) 
    }

    async stop(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(chalk.blue("< DOCKER >: DETENIENDO CONTENEDOR..."))
            const docker = spawn('docker', ['compose', 'down', '-v'], {
                stdio: "inherit"
            })
            docker.on('close', (code) => {
                if(code == 0){
                    console.log(chalk.blue("< DOCKER >: EL CONTENEDOR SE HA DETENIDO CON ÉXITO."));
                    return resolve()
                }
                else{
                    console.error(chalk.blue("< DOCKER >: EL CONTENEDOR SE HA DETENIDO DE FORMA INESPERADA."));
                    return reject();
                }
            })
        })
    }

    async waitUntilHealthy(){
        while(true){
            let status = await this.isHealthy();
            if(status == true){
                console.log(chalk.blue("< DOCKER >:") + chalk.green(" CONEXIÓN CON LA BASE DE DATOS ESTABLECIDA CON ÉXITO!"))
                break;
            }
            else
            {
                console.log(chalk.blue("< DOCKER >: INTENTANDO CONECTAR A LA BASE DE DATOS..."))
                await this.sleep(3000)
            }
        }
    }

    async isHealthy(): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            const health = spawn('docker', ['inspect', 'LMS_mysql_db', '--format', '"{{.State.Health.Status}}"'], {
            })

            let output = ''

            health.stdout.on('data', (data) => {
                output += JSON.parse(data);
            });

            health.on('close', (code) => {
                if(code != 0){
                    console.error("HA OCURRIDO UN ERROR DURANTE LA INSPECCIÓN DEL CONTENEDOR.")
                    return;
                }

                resolve(output === "healthy")
            })

            health.on('error', (error) => {
                console.error("HA OCURRIDO UN ERROR DURANTE LA INSPECCIÓN DEL CONTENEDOR: ")
                console.error(error);
                reject()
            })
        })

    }
}