<template>
    <div>
        <v-container fluid>
            <v-row align="center" v-if="usuario">
                <v-col col="12" sm="6" md="4">
                    <v-row>
                        <v-col cols="8">
                            <v-text-field v-model="busqueda" outlined label="Buscar" append-icon="mdi-magnify" type="text" autocomplete="off" hide-details dense></v-text-field>
                        </v-col>
                        <v-col v-if="!usuario.atiende_paciente">
                            <v-select
                                :items="years"
                                label="Año"
                                outlined
                                hide-details dense
                                v-model="year_filtro"
                                @change="obtener_pacientes()"
                            ></v-select>
                        </v-col>
                    </v-row>
                    
                    <!-- Filtrar por año -->
                    
                </v-col>
                <v-col v-if="usuario.agregar_paciente" align="end" col="12" sm="6" md="8">
                    <v-btn  @click="show_dialog = true" dark color="blue darken-4">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </v-col>
                <v-col v-if="usuario.atiende_paciente" align="end" col="12" md="8">
                    <v-menu 
                        v-model="menu"
                        :close-on-content-click="false"
                        :max-width="400"
                        :nudge-width="200"
                        offset-x
                    >
                        <template v-slot:activator="{ on, attrs }">
                           
                            <h4 v-bind="attrs" v-on="on" :class="usuario.en_linea ? 'green--text' : 'error--text'">
                                {{ usuario.en_linea ? 'En línea' : 'Desconectado' }}
                                <v-icon :color="usuario.en_linea ? 'green' : 'error'" x-small>
                                    mdi-checkbox-blank-circle
                                </v-icon>
                            </h4>
                            <small>{{ usuario.clinica ? usuario.clinica.nombre : 'Clinica sin asignar' }}</small>
                        </template>
                        <v-card>
                            <v-list>
                                <v-list-item>
                                <span class="headline">Configuración</span>
                                </v-list-item>
                            </v-list>

                            <v-divider></v-divider>

                            <v-list>
                                <v-list-item>
                                    <v-list-item-action>
                                        <v-switch v-model="en_linea" color="primary"></v-switch>
                                    </v-list-item-action>
                                    <v-list-item-title>En línea</v-list-item-title>
                                </v-list-item>

                                <v-list-item>
                                    <v-radio-group v-model="clinica_seleccionada">
                                        <v-radio
                                            v-for="clinica in clinicas"
                                            :key="clinica.id"
                                            :label="clinica.nombre"
                                            :value="clinica.id"
                                        ></v-radio>
                                    </v-radio-group>
                                </v-list-item>
                            </v-list>

                            <v-divider></v-divider>

                            <v-card-actions>
                                <v-spacer></v-spacer>

                                <v-btn text @click="menu = false">Cancelar</v-btn>
                                <v-btn color="primary" text @click="configuracion_medico()">Guardar</v-btn>
                            </v-card-actions>
                        </v-card>
                     </v-menu>
                    
                </v-col>
                <v-col align="end" v-if="usuario.filtrar_campamentos">
                    <v-btn-toggle dense v-model="campamento_filtrado" tile color="primary" shaped mandatory>
                        <v-btn @click="filtrar_pacientes_campamento(campamento)" v-for="(campamento, index) in campamentos" :key="index">
                            {{ campamento.nombre }}
                        </v-btn>

                        <!-- <v-btn>
                            Colonia Maya Z.18
                        </v-btn>

                        <v-btn>
                            Ineb Z.21
                        </v-btn> -->

                    </v-btn-toggle>
                </v-col>
            </v-row>

            <!-- Alerta -->
            <v-alert v-if="paciente_asignado" type="info" prominent dense text>
                <v-row align="center" dense no-gutters>
                    <!-- <v-col cols="12">
                        Le a sigo asignado un paciente
                        
                    </v-col> -->
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
                            <v-btn 
                                @click="() => {
                                    id_paciente = item.id
                                    nombre_paciente = item.nombre
                                    show_dialog_estado = true
                                }" 
                                tile icon small color="info">
                                <v-icon dark>mdi-swap-horizontal-bold</v-icon>
                            </v-btn>

                            <v-btn class="ml-3" tile icon  @click="detalle(item)" small color="primary">
                                <v-icon dark>mdi-pencil</v-icon>
                            </v-btn>
                            
                        </template>

                        <template v-slot:item.estado="{ item }">
                            <v-chip :color="item.color" small dark>{{ item.estado }}</v-chip>
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

    import Form from '@/components/Pacientes/Form.vue'
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
                id_campamento_filtrado: null,
                years: [2022, 2021, 2020],
                year_filtro: 2022,
                loading: false

            }
        },
        methods: {

            obtener_pacientes(){

                this.loading = true

                let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))
                usuario.id_campamento_filtrado = this.id_campamento_filtrado
                usuario.year_filtro = this.year_filtro

                this.axios.post(process.env.VUE_APP_API_URL + 'obtener_pacientes.php', usuario)
                .then((response) => {
                    this.items = response.data.items
                    this.headers = response.data.headers
                    this.loading = false
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

                // let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))
                // usuario.id_campamento_filtrado = campamento.id

                // this.axios.post(process.env.VUE_APP_API_URL + 'obtener_pacientes.php', usuario)
                // .then((response) => {
                //     this.items = response.data.items
                //     this.headers = response.data.headers
                // })

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