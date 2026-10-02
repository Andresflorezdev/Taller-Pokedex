async function explorar() {
    const pokemones = ['pikachu', 'charizard', 'bulbasaur'];

    for (const pokemon of pokemones) {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        if (!respuesta.ok) {
            console.log("Esto salio mal. Codigo: ", respuesta.status);
        return;
        }
        const datos = await respuesta.json();
        //console.log(datos);
        console.log('\nPokemon: ',datos.name);

        // Ejercicio 1
        console.log("Tipos o Types");
        for (const t of datos.types) {
            console.log(t.type.name)
        }
        
        console.log("\nStats");
        for (const s of datos.stats) {
            console.log(s.stat.name,"=",s.base_stat);
        }
        
        console.log("\nHabilidades");
        for (const a of datos.abilities){
            console.log(a.ability.name);
        }
    }
}

explorar();