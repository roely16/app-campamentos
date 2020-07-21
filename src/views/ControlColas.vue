<template>
    <div style="line-height: 1">
        <div style="background-image: url('./img/fondoLogin.png'); height: 100vh; background-size:cover" fluid>
            <v-row align="center" justify="center" no-gutters dense style="height: 75vh">
                
                <v-col cols="11">
                    <v-card dark color="blue darken-4">
                        <v-row justify="center" align="center" style="height: 85vh">
                            <v-col v-if="paciente" style="height: 60vh" cols="12" class="text-center">
                                <strong>
                                    <span style="font-size: 40em">{{ paciente.correlativo }}</span>
                                </strong>
                            </v-col>
                            <v-col v-if="paciente" align="center" cols="11" style="height: 12vh; width: 50%;
                                        font-size: 4.5rem;
                                        background: rgba(0,0,0,0.3);
                                        color: white;">
                                <span class="yellow--text">{{ paciente.nombre.toUpperCase() }} {{ paciente.apellido.toUpperCase() }}</span>
                            </v-col>
                            <v-col v-if="clinica" align="center" cols="11" style="height: 12vh; width: 50%;
                                        background: rgba(0,0,0,0.3);
                                        color: white;">
                                <span style="font-size:5rem" class="yellow--text">{{ clinica.nombre.toUpperCase() }}</span>
                            </v-col>
                            
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-row dense no-gutters align="end" justify="center" style="height: 24vh">
                <v-col  cols="10">
                    <span style="font-size: 5em" class="white--text font-weight-black">{{ display_reloj }}</span>
                </v-col>
                <v-col cols="1">
                    <v-img width="70" src="@/assets/logo_muni_circulo.png" contain></v-img>
                </v-col>
                <v-col cols="1">
                    <v-img width="200" src="@/assets/logoAve.png" contain></v-img>
                </v-col>

            </v-row>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                display_reloj: null,
                clinica: null,
                paciente: null,
                repeticiones: 4,
                repeticiones_realizadas: 0,
                ultimo_paciente: null,
                ultima_clinica: null
            }
        },
        mounted(){

            this.reloj()
            

            this.$nextTick(function () {
            window.setInterval(() => {
                this.obtener_paciente()
            },5000);

            // eslint-disable-next-line no-undef
        })
            
        },
        methods: {
            reloj(){

                var today = new Date();
                var h = today.getHours();
                var m = today.getMinutes();
                var s = today.getSeconds();
                m = this.checkTime(m);
                s = this.checkTime(s);
                this.display_reloj =  h + ":" + m + ":" + s;
                setTimeout(this.reloj, 500);

            },
            checkTime(i){

                if (i < 10) {i = "0" + i}  // add zero in front of numbers < 10
                return i;

            },
            obtener_paciente(){

                let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

                let data = {
                    id_usuario: usuario.id
                }

                this.axios.post(process.env.VUE_APP_API_URL + 'obtener_clinica_disponible.php', data)
                .then((response) => {

                    console.log(response.data);
                    
                    if (response.data) {
                        
                        if (this.ultimo_paciente != response.data.paciente.id) {

                            // Es diferente el paciente o la clinica, por lo tanto reiniciar las repeticiones 
                            this.ultimo_paciente = response.data.paciente.id
                            this.ultima_clinica = response.data.clinica.id  
                            this.repeticiones_realizadas = 0
                        }

                        this.paciente = response.data.paciente
                        this.clinica = response.data.clinica
                        
                        // Repetir 3 veces
                        while (this.repeticiones > this.repeticiones_realizadas) {
                            
                            // eslint-disable-next-line no-undef
                            responsiveVoice.speak("Número " + response.data.paciente.correlativo, "Spanish Latin American Female");

                            // eslint-disable-next-line no-undef
                            responsiveVoice.speak(response.data.paciente.nombre + ' ' + response.data.paciente.apellido, "Spanish Latin American Female");

                            // eslint-disable-next-line no-undef
                            responsiveVoice.speak(response.data.clinica.nombre, "Spanish Latin American Female");

                            this.repeticiones_realizadas++;
                        }
                        

                    }
                    
                })


            },
        },

    }
</script>