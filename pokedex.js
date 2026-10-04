/* 
    Diferencia rápida:
    - Stat (Estadística): Número de atributo de combate (hp, attack, defense, speed).
    - Habilidad (Ability): Efecto o poder especial pasivo (ej. overgrow, static).
*/

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

function MostrarFicha(datos) {
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
        if (a.is_hidden) // "is_hidden" sirve para indicar si una habilidad de un Pokémon es una habilidad oculta.
        {
            console.log(a.ability.name, "oculta");
        } else {
            console.log(a.ability.name);
        }
    }
}

function obtenerStat(datos, nombreStat) {
    for (const s of datos.stats) {
        if (s.stat.name === nombreStat) {
            return s.base_stat;
        }
    }

    return null;
}

async function compararPokemon(nombre1, nombre2, stat) {
    const pokemon1 = await buscarPokemon(nombre1);
    const pokemon2 = await buscarPokemon(nombre2);

    if (!pokemon1 || !pokemon2) {
        console.log("\nNo se pueden comparar los Pokemon");
        return;
    }

    const valor1 = obtenerStat(pokemon1, stat);
    const valor2 = obtenerStat(pokemon2, stat);

    if (valor1 === null || valor2 === null) {
        console.log("\nLa stat no existe");
        console.log("Stats validadas: hp, attack, defense, special-attack, special-defense, speed");
        return;
    }

    console.log("\nComparacion");
    console.log(pokemon1.name, "=", valor1);
    console.log(pokemon2.name, "=", valor2);
    
    if (valor1 > valor2) {
        console.log(pokemon1.name, "gana en", stat);
    } else if (valor2 > valor1) {
        console.log(pokemon2.name, "gana en", stat);
    } else {
        console.log("Hay un empate en", stat);
    }
}

async function pokemonMasFuerte(listaNombres, stat) {
    // Guardar valores en las variables
    let mejorNombre = "";
    let mejorValor = -1;

    // Recorrer listaNombres
    for (const nombre of listaNombres) {
        const pokemon = await buscarPokemon(nombre);

        // Si vino null, saltarlo y seguir con (continue)
        if (!pokemon) {
            continue;
        }

        // Obtener su valor de la stat. Si es null, se ejecuta continue
        const valorStat = obtenerStat(pokemon, stat);

        if (valorStat === null) {
            continue;
        }

        // Si su valor es mayor al mejor guardado hasta ahora, actualizar ambas variables
        if (valorStat > mejorValor) {
            mejorValor = valorStat;
            mejorNombre = pokemon.name;
        }
    }

    // Al terminar de recorrer toda la lista, mostrar quién ganó y retornar su nombre
    if (mejorNombre !== "") {
        console.log(`\nEl Pokémon más fuerte en '${stat}' es: ${mejorNombre.toUpperCase()} con ${mejorValor}`);
    } else {
        console.log("\nNo se pudo encontrar un ganador.");
    }

    return mejorNombre;
}

async function mostrarMenu() {
    let salir = false;

    while (!salir) {
        console.log("\n==================================");
        console.log("        MENÚ DE POKÉDEX          ");
        console.log("==================================");
        console.log("1. Buscar un Pokémon (Ejercicios 1, 2 y 3)");
        console.log("2. Comparar dos Pokémon (Ejercicio 4)");
        console.log("3. Encontrar el Pokémon más fuerte de un equipo (Ejercicio 5)");
        console.log("S. Salir");
        console.log("==================================");

        const opcion = prompt("Selecciona una opción: ").trim().toLowerCase();
        // trim() sirve para eliminar espacios en blanco

        if (opcion === "1") {
            const nombre = prompt("Ingresa el nombre del Pokémon a buscar: ");
            const pokemon = await buscarPokemon(nombre);
            MostrarFicha(pokemon);
        } else if (opcion === "2") {
            const p1 = prompt("Ingresa el nombre del primer Pokémon: ");
            const p2 = prompt("Ingresa el nombre del segundo Pokémon: ");
            const stat = prompt("Ingresa la stat a comparar (hp, attack, defense): ");
            await compararPokemon(p1, p2, stat);
        } else if (opcion === "3") {
            const miEquipo = ["pikachu", "charizard", "snorlax", "blastoise", "machamp", "gengar"];
            console.log("\nEquipo a evaluar:", miEquipo.join(", "));
            
            // Encontrar el más fuerte en attack
            const ganadorAtaque = await pokemonMasFuerte(miEquipo, "attack");
            
            // Encontrar el más fuerte en defense
            await pokemonMasFuerte(miEquipo, "defense");

            // Mostrar la ficha completa del ganador en attack
            if (ganadorAtaque) {
                console.log("\n--- Ficha del ganador en Ataque ---");
                const datosGanador = await buscarPokemon(ganadorAtaque);
                MostrarFicha(datosGanador);
            }
        } else if (opcion === "s") {
            console.log("\n¡Saliendo del programa... hasta luego!");
            salir = true;
        } else {
            console.log("\nOpción inválida. Intenta nuevamente.");
        }
    }
}
mostrarMenu();