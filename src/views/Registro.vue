<template>
    <v-main>
        <v-container fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" lg="5" justify="center" align="center">
                    <v-row align="center" justify="center">
                        <v-col cols="4" lg="4" xs="6" sm="2" md="2">
                            <v-img width="100%" contain src="@/assets/logo_muni_circulo.png"></v-img>
                        </v-col>
                        <v-col cols="6" lg="6" xs="6" sm="3" md="3">
                            <v-img width="100%" contain src="@/assets/logoAve.png"></v-img>
                        </v-col>
                    </v-row>
                    
                </v-col>
                <v-col cols="12" lg="6">
                    <v-row class="text-center">

                        <!-- <v-col cols="2" lg="7">
                            <v-btn :to="{name: 'login'}" icon class="blue--text">
                                <v-icon>
                                    mdi-arrow-left
                                </v-icon>
                            </v-btn>
                        </v-col> -->
                        <v-col align="center">
                            <h1 class="blue--text">Bienvenido</h1>
                        </v-col>
                    </v-row>

                    <v-row justify="center">
                        <v-col xs="12" sm="8" md="8" lg="8">
                            <v-form ref="form_registro" v-model="valid_form">

                                <v-text-field :rules="[v => !!v || 'Campo obligatorio!']" v-model="nuevo_usuario.nombre" outlined label="Nombre" prepend-icon="mdi-account" type="text" autocomplete="off"></v-text-field>

                                <v-text-field :rules="[v => !!v || 'Campo obligatorio!']" v-model="nuevo_usuario.apellido" outlined label="Apellido" prepend-icon="mdi-account" type="text" autocomplete="off"></v-text-field>

                                <v-text-field :rules="[v => !!v || 'Campo obligatorio!']" v-model="nuevo_usuario.telefono" outlined label="Telefono" prepend-icon="mdi-phone" type="text" autocomplete="off"></v-text-field>

                                <v-text-field :rules="[v => !!v || 'Campo obligatorio!']" v-model="nuevo_usuario.password" outlined label="Contraseña" prepend-icon="mdi-lock" :append-icon="!show_password ? 'mdi-eye' : 'mdi-eye-off'" :type="show_password ? 'text' : 'password'" @click:append="show_password = !show_password" autocomplete="off"></v-text-field>

                                <v-text-field :rules="[v => !!v || 'Campo obligatorio!']" v-model="nuevo_usuario.repite_password" outlined label="Repite Contraseña" prepend-icon="mdi-lock" :append-icon="!show_repite_password ? 'mdi-eye' : 'mdi-eye-off'" :type="show_repite_password ? 'text' : 'password'" @click:append="show_repite_password = !show_repite_password" autocomplete="off"></v-text-field>

                                <v-text-field :rules="[v => !!v || 'Campo obligatorio!']" v-model="nuevo_usuario.email" outlined label="Email" prepend-icon="mdi-email" type="email" autocomplete="off"></v-text-field>

                                <v-divider class="mb-5"></v-divider>

                                <v-checkbox
                                    v-model="privado"
                                    class="mt-0 pt-0"
                                    label="Campamento Privado"
                                    prepend-icon="mdi-domain"
                                ></v-checkbox>

                                <v-combobox v-if="privado" :rules="[v => !!v || 'Campo obligatorio!']" v-model="nuevo_usuario.empresa" outlined label="Empresa" :items="empresas" item-text="nombre" item-value="id" prepend-icon="mdi-medical-bag"></v-combobox>

                                <v-combobox :rules="[v => !!v || 'Campo obligatorio!']" v-model="nuevo_usuario.campamento" outlined label="Campamento" :items="campamentos" item-text="nombre" item-value="id" prepend-icon="mdi-medical-bag"></v-combobox>

                                <v-combobox :rules="[v => !!v || 'Campo obligatorio!']" v-model="nuevo_usuario.rol" outlined label="Rol" :items="roles" item-text="nombre" item-value="id" prepend-icon="mdi-badge-account-horizontal-outline"></v-combobox>

                                <v-row dense no-gutters>
                                    <v-col cols="1">
                                        <v-checkbox v-model="nuevo_usuario.terminos" hide-details :rules="[v => !!v || 'Campo obligatorio!']"  style="text-align: center;" class="mt-0 pt-0 text-center">
                                    
                                        </v-checkbox>
                                    </v-col>
                                    <v-col>
                                        
                                        <Terminos @aceptarTerminos="aceptar_terminos()"/>
                                    </v-col>
                                </v-row>
                                <v-row class="text-center mt-2">
                                    <v-col>
                                        <v-btn :loading="registrando" :disabled="registrando || !nuevo_usuario.terminos" @click="registro()" x-large color="success">Aceptar 
                                            <v-icon>mdi-login</v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-col>
                    </v-row>
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

    import Terminos from '@/components/Login/Terminos.vue'
    import Swal from 'sweetalert2'

    export default {
        components: {
            Terminos
        },
        data(){
            return{
                campamentos: [],
                roles: [],
                nuevo_usuario: {
                    terminos: false
                },
                valid_form: true,
                registrando: false,
                dialog: false,
                message: null,
                status: null,
                privado: false,
                empresas: [],
                show_password: false,
                show_repite_password: false
            }
        },
        methods: {
            obtener_dependencias(){

                this.axios.get(process.env.VUE_APP_API_URL + 'datos_registro.php')
                .then((response) => {
                    this.campamentos = response.data.campamentos
                    this.roles = response.data.roles
                    this.empresas = response.data.empresas
                })

            },
            registro(){

                this.$refs.form_registro.validate()

                if (this.valid_form) {
                    
                    if (this.nuevo_usuario.password == this.nuevo_usuario.repite_password) {
                        
                        this.registrando = true

                        console.log(this.nuevo_usuario);

                        this.axios.post(process.env.VUE_APP_API_URL + 'registro.php', this.nuevo_usuario)
                        .then((response) => {

                            this.dialog = true
                            this.registrando = false

                            this.message = response.data.message
                            this.status = response.data.status
                        })

                    }else{

                        Swal.fire({
                            icon: 'error',
                            title: 'Error...',
                            text: 'Ambas contraseñas deben de coincidir!',
                        })


                    }

                }
                

            },
            obtener_campamentos_privados(){

                if (this.nuevo_usuario.empresa) {
                    
                    let data = {
                        id_empresa: this.nuevo_usuario.empresa.id
                    }

                    console.log(data);

                    this.axios
                    .post(process.env.VUE_APP_API_URL + 'obtener_campamentos_privados.php', data)
                    .then((response) => {
                        console.log(response.data)
                        this.campamentos = response.data.campamentos
                        this.roles = response.data.roles
                    })
                }
                

            },
            aceptar_terminos(){

                console.log('aceptar terminos');
                this.nuevo_usuario.terminos = true

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
            },
            'nuevo_usuario.empresa' : function(val){

                if (val) {
                    
                    this.obtener_campamentos_privados()

                }

            }

        },
        mounted(){

            this.obtener_dependencias()

        }

    }
</script>