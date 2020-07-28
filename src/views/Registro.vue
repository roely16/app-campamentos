<template>
    <v-main>
        <v-container fluid >
            <v-row  class="text-center">
                <v-col cols="2" lg="7">
                    <v-btn :to="{name: 'login'}" icon class="blue--text">
                        <v-icon>
                            mdi-arrow-left
                        </v-icon>
                    </v-btn>
                </v-col>
                <v-col align="left">
                    <h2 class="blue--text">Registrarse</h2>
                </v-col>
            </v-row>

            <v-row  justify="center">
                <v-col xs="12" sm="12" md="6" lg="6">
                    <v-form ref="form_registro" v-model="valid_form">

                        <v-text-field :rules="[v => !!v || 'Campo obligatorio!']" v-model="nuevo_usuario.nombre" outlined label="Nombre" prepend-icon="mdi-account" type="text" autocomplete="off"></v-text-field>

                        <v-text-field :rules="[v => !!v || 'Campo obligatorio!']" v-model="nuevo_usuario.apellido" outlined label="Apellido" prepend-icon="mdi-account" type="text" autocomplete="off"></v-text-field>

                        <v-text-field :rules="[v => !!v || 'Campo obligatorio!']" v-model="nuevo_usuario.telefono" outlined label="Telefono" prepend-icon="mdi-phone" type="text" autocomplete="off"></v-text-field>

                        <v-text-field :rules="[v => !!v || 'Campo obligatorio!']" v-model="nuevo_usuario.email" outlined label="Email" prepend-icon="mdi-email" type="email" autocomplete="off"></v-text-field>

                        <v-divider class="mb-5"></v-divider>

                        <v-checkbox
                            v-model="privado"
                            class="mt-0 pt-0"
                            label="Campamento Privado"
                            prepend-icon="mdi-domain"
                        ></v-checkbox>


                        <v-combobox :rules="[v => !!v || 'Campo obligatorio!']" v-model="nuevo_usuario.campamento" outlined label="Campamento" :items="campamentos" item-text="nombre" item-value="id" prepend-icon="mdi-medical-bag"></v-combobox>

                        <v-combobox :rules="[v => !!v || 'Campo obligatorio!']" v-model="nuevo_usuario.rol" outlined label="Rol" :items="roles" item-text="nombre" item-value="id" prepend-icon="mdi-badge-account-horizontal-outline"></v-combobox>

                        <v-row class="text-center">
                            <v-col>
                                <v-btn :loading="registrando" :disabled="registrando" @click="registro()" dark x-large color="success">Aceptar 
                                    <v-icon>mdi-login</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-col>
            </v-row>
        </v-container>

        <v-dialog
            v-model="dialog"
            max-width="290"
        >
            <v-card>
                <v-card-title class="headline">Registro</v-card-title>

                <v-card-text>

                    <div v-html="message" class="mt-4">
                    </div>

                </v-card-text>

                <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    color="gray darken-1"
                    text
                    @click="status != 100 ? $router.push('/') : dialog = false"
                >
                    Cerrar
                </v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-main>
</template>

<script>
    export default {
        data(){
            return{
                campamentos: [],
                roles: [],
                nuevo_usuario: {},
                valid_form: true,
                registrando: false,
                dialog: false,
                message: null,
                status: null,
                privado: false
            }
        },
        methods: {
            obtener_dependencias(){

                this.axios.get(process.env.VUE_APP_API_URL + 'datos_registro.php')
                .then((response) => {
                    this.campamentos = response.data.campamentos
                    this.roles = response.data.roles
                })

            },
            registro(){

                this.$refs.form_registro.validate()

                if (this.valid_form) {
                    
                    this.registrando = true

                    this.axios.post(process.env.VUE_APP_API_URL + 'registro.php', this.nuevo_usuario)
                    .then((response) => {

                        console.log(response.data)

                        this.dialog = true
                        this.registrando = false

                        this.message = response.data.message
                        this.status = response.data.status
                    })

                }
                

            },
            obtener_campamentos_privados(){

                this.axios.get(process.env.VUE_APP_API_URL + 'obtener_campamentos_privados.php')
                .then((response) => {
                    console.log(response.data)
                    this.campamentos = response.data.campamentos
                    this.roles = response.data.roles
                })

            }   
        },
        watch: {

            privado(val){

                this.campamentos = []
                this.roles = []
                this.nuevo_usuario.rol = null
                this.nuevo_usuario.campamento = null

                if (val) {
                    this.obtener_campamentos_privados()
                }else{
                    this.obtener_dependencias()
                }
            }

        },
        mounted(){

            this.obtener_dependencias()

        }

    }
</script>