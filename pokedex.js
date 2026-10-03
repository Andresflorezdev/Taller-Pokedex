const prompt = require('prompt-sync')();

async function buscarPokemon(nombre) {
    const url = `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`;

    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        console.log("Esto salio mal. Codigo: ", respuesta.status);
        return null;
    }
    return await respuesta.json();
}

async function MostrarFicha(datos) {
    if (!datos) {
        console.log("No hay pokemones que mostrar");
        return;
    }

    console.log("\nFicha Pokemon");
    console.log("Nombre: ", datos.name.toUpperCase());
    console.log("ID: ", datos.id);
    
    const tipos = [];

    for (const tipo of datos.types) {
        tipos.push(tipo.type.name);
    }

    console.log("Tipos: ", tipos.join(" / "));

    const alturacm = datos.height * 10;
    const pesokg = datos.weight / 10;

    console.log("Altura: ", alturacm, "cm");
    console.log("Peso: ", pesokg, "kg");

    console.log("\nStats:");
    for (const s of datos.stats) {
        console.log(s.stat.name, "=", s.base_stat);
    }

    console.log("\nHabilidades:");

    for (const a of datos.abilities) {
        if (a.is_headen) {
            console.log(a.ability.name, "oculta");
        } else {
            console.log(a.ability.name);
        }
    }
}

async function Ejecutar_por_consola() {
    const nombre = prompt("Pokemon a Buscar: ");

    const pokemon = await buscarPokemon(nombre);

    if (pokemon !== null) {
        console.log("Nombre: ", pokemon.name);
        console.log("ID: ", pokemon.id);
    }
}

Ejecutar_por_consola();