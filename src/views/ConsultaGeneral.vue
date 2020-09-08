<template>
    <div>
        <v-container fluid>
            <v-row align="center" v-if="usuario">
                <v-col col="12" sm="6" md="4">
                    <v-text-field v-model="busqueda" outlined label="Buscar" append-icon="mdi-magnify" type="text" autocomplete="off" hide-details dense></v-text-field>
                </v-col>
               
                
            </v-row>

            <!-- Alerta -->
            <v-alert v-if="paciente_asignado" type="info" prominent dense text>
                <v-row align="center" dense no-gutters>
                   
                    <v-col>
                        <small>Paciente: </small>
                        <br>
                        <span class="headline">{{ paciente_asignado.nombre.toUpperCase() }} {{ paciente_asignado.apellido.toUpperCase() }}</span>
                    </v-col>
                    <v-col class="shrink">
                        <v-btn @click="paciente_si()" tile icon color="success">
                            <v-icon>
                                mdi-checkbox-marked-circle
                            </v-icon>
                        </v-btn>
                        <v-btn @click="paciente_no()" tile icon color="error">
                            <v-icon>
                                mdi-close-circle
                            </v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-alert>

            <v-row>
                <v-col cols="12">
                    <v-data-table
                        :headers="headers"
                        :items="items"
                        :items-per-page="20"
                        class="elevation-1"
                        hide-default-footer
                        :search="busqueda"
                        :page.sync="page"
                        @page-count="pageCount = $event"
                    >
                        <template v-slot:item.accion="{ item }">
                           

                            <v-btn class="ml-3" tile icon  @click="detalle(item)" small color="primary">
                                <v-icon dark>mdi-pencil</v-icon>
                            </v-btn>
                            
                        </template>

                        <template v-slot:item.colonia="{ item }">
                           

                            <div v-if="item.colonia != 'SIN COLONIA'">
                                {{ item.colonia }}
                            </div>

                            <div v-if="item.colonia == 'SIN COLONIA'">
                                <div v-if="item.otra_colonia">
                                    {{ item.otra_colonia }}
                                </div>
                                <div v-if="!item.otra_colonia">
                                    SIN COLONIA
                                </div>
                            </div>
                            
                        </template>

                        

                    </v-data-table>
                </v-col>
                <v-col cols="12">
                    <v-pagination
                        v-model="page"
                        :length="pageCount"
                        :total-visible="5"
                    ></v-pagination>
                </v-col>
            </v-row>
        </v-container>

        <Form :usuario="usuario" @actualizarTabla="obtener_pacientes()" :obtener_detalle="obtener_detalle" :id_paciente="id_paciente" :show_dialog="show_dialog" @closeDialog="() => {
            obtener_detalle = false
            id_paciente = null
            show_dialog = false    
        }" />

        <CambioEstado 
            :show_dialog="show_dialog_estado" 
            :id_paciente="id_paciente"
            :nombre_paciente="nombre_paciente"
            @closeDialog="() => {
                show_dialog_estado = false
            }"
            @actualizarTabla="obtener_pacientes()"
            @borrarBusqueda="() => {
                busqueda = null
            }"
        />
    </div>
</template>

<script>

    import Form from '@/components/Pacientes/FormConsulta.vue'
    import CambioEstado from '@/components/Pacientes/CambioEstado.vue'

    export default {
        components: {
            Form,
            CambioEstado
        },
        data () {
            return {

                items: [],
                headers: [],
                busqueda: null,
                show_dialog: false,
                obtener_detalle: false,
                id_paciente: null,
                nombre_paciente: null,
                apellido_paciente: null,
                usuario: null,
                show_dialog_estado: false,
                page: 1,
                pageCount: null,
                fav: true,
                menu: false,
                message: false,
                hints: true,
                clinicas: [],
                clinica_seleccionada: 0,
                en_linea: false,
                paciente_asignado: null,
                campamento_filtrado: null,
                campamentos: [],
                id_campamento_filtrado: null

            }
        },
        methods: {

            obtener_pacientes(){

                let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))
                usuario.id_campamento_filtrado = this.id_campamento_filtrado

                this.axios.post(process.env.VUE_APP_API_URL + 'obtener_todos_pacientes.php', usuario)
                .then((response) => {
                    this.items = response.data.items
                    this.headers = response.data.headers
                })

            },
            detalle(item){

                this.obtener_detalle = true
                this.id_paciente = item.id
                this.show_dialog = true

            },
            detalle_usuario(){

                let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

                let data = {
                    id_usuario: usuario.id
                }

                this.axios.post(process.env.VUE_APP_API_URL + 'detalle_usuario.php', data)
                .then((response) => {
                    
                    this.usuario = response.data 
                    this.en_linea = response.data.en_linea 

                    if (response.data.clinica) {
                        
                        this.clinica_seleccionada = response.data.clinica.id

                    }else{

                        this.clinica_seleccionada = 0

                    }

                })

            },
            cambio_estado(){

                this.show_dialog_estado = true

            },
            configuracion_medico(){

                let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

                let data = {
                    id_usuario: usuario.id,
                    en_linea: this.en_linea,
                    clinica: this.clinica_seleccionada
                }

                this.axios.post(process.env.VUE_APP_API_URL + 'configurar_medico.php', data)
                .then((response) => {
                    console.log(response.data)

                    this.detalle_usuario()
                    this.menu = false

                    
                })

            },
            obtener_paciente(){

                let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

                let data = {
                    id_usuario: usuario.id,
                }

                this.axios.post(process.env.VUE_APP_API_URL + 'obtener_paciente_asignado.php', data)
                .then((response) => {
                    console.log(response.data)
                    this.paciente_asignado = response.data

                })

            },
            paciente_no(){

                this.axios.post(process.env.VUE_APP_API_URL + 'paciente_ausente.php', this.paciente_asignado)
                .then((response) => {

                    console.log(response.data)
                    this.paciente_asignado = null
                    this.obtener_paciente()
                    this.obtener_pacientes()

                })
            },
            paciente_si(){

                this.axios.post(process.env.VUE_APP_API_URL + 'atendiendo_paciente.php', this.paciente_asignado)
                .then((response) => {

                    console.log(response.data)
                    this.busqueda = this.paciente_asignado.nombre + ' ' + this.paciente_asignado.apellido
                    this.paciente_asignado = null
                    this.obtener_paciente()
                    this.obtener_pacientes()

                })

            },
            obtener_campamentos(){

                this.axios.get(process.env.VUE_APP_API_URL + 'datos_registro.php').then((response) => {
                    console.log(response.data)
                    this.campamentos = response.data.campamentos
                })

            },
            filtrar_pacientes_campamento(campamento){

                this.id_campamento_filtrado = campamento.id

                this.obtener_pacientes()
                
            }

        },
        watch: {
            menu: function(val){

                if (val) {
                    
                    let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

                    let data = {
                        id_usuario: usuario.id
                    }

                    this.axios.post(process.env.VUE_APP_API_URL + 'obtener_clinicas_disponibles.php', data)
                    .then((response) => {

                        this.clinicas = response.data
                        console.log(response.data);
                        
                    })

                }

            }
        },
        mounted(){

            this.detalle_usuario()
            this.obtener_pacientes()
            this.obtener_campamentos()

            let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

            this.campamento_filtrado = usuario.id_campamento - 1

            this.$nextTick(function () {
            window.setInterval(() => {
                this.obtener_paciente()
                this.obtener_pacientes()
            },5000);
            })

        }
    }
</script>