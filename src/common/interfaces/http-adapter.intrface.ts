
export interface HttpAdapter {
    get<T>( url: string) : Promise<T>     //acepta un url y devuelve una promesa
}