<template>
    <div>
        <v-container fluid style="background-image: url('./img/fondoLogin.png'); height: 100vh; background-size:cover">
            <v-row style="height: 25vh" dense align="center" justify="center">
                <v-col cols="5" md="2" lg="2">
                    <v-img src="/img/logo_muni_circulo.png" contain></v-img>
                </v-col>
            </v-row>

            <v-row justify="center" align="center" style="height: 25vh">
                <v-col v-if="activando" xs="12" lg="6" sm="6">
                    <h3 class="white--text">La cuenta esta siendo rechazada...</h3>
                    <v-progress-linear
                        indeterminate
                        color="red darken-2"
                    ></v-progress-linear>
                </v-col>
                <v-col xs="12" lg="4" sm="6" v-if="!activando">
                    <v-alert border="left" colored-border class="mt-4" dense type="error">
                        <h3 class="text-center">La cuenta a sido rechazada exitosamente.</h3>
                    </v-alert>
                </v-col>
                
            </v-row>
            <v-row>
                <v-col v-if="!activando" class="text-center">
                    <v-btn :to="{name: 'login'}" dark x-large color="success">Iniciar Sesión 
                        <v-icon>
                            mdi-login
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            
        </v-container>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                activando: false
            }
        },  
        methods: {
            activar_cuenta(){

                this.activando = true

                let data = {
                    id: this.$route.params.id
                }

                this.axios.post(process.env.VUE_APP_API_URL + 'rechazar_cuenta.php', data)
                .then((response) => {
                    console.log(response.data)
                    this.activando = !response.data
                })

            }
        },
        mounted(){

            this.activar_cuenta();

        }
    }
</script>