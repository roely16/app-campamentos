<template>
    <div>
        <v-container fluid>
            <v-row dense no-gutters align="center">
                <v-col col="12" sm="6" md="4">
                    <v-text-field v-model="busqueda" outlined label="Buscar" append-icon="mdi-magnify" type="text" autocomplete="off" hide-details dense></v-text-field>
                </v-col>
                <v-col align="end">
                    <h1 class="pb-0 mb-0" style="font-size: 3em">{{ items.length }}</h1>
                    <small class="font-weight-light mt-0 pt-0">Constancias Pendientes</small>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-tabs v-model="tab" background-color="blue accent-4" show-arrows dark>
                        <v-tab @click="obtener_pacientes(campamento.id)" v-for="(campamento, index) in campamentos" :key="index">{{ campamento.nombre }} 
                        </v-tab>
                    </v-tabs>
                </v-col>
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
                        <template v-slot:item.nombre="{ item }">
                            {{ item.nombre.toUpperCase() }} {{ item.segundo_nombre.toUpperCase() }} {{ item.apellido.toUpperCase() }} {{ item.segundo_apellido.toUpperCase() }}
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
                        
                        <template v-slot:item.accion="{ item }">
                            <v-btn tile icon @click="atender(item)" dark color="success">
                                <v-icon dark>mdi-check</v-icon>
                            </v-btn>

                            <!-- <v-btn class="ml-3" tile icon  @click="detalle(item)" small color="primary">
                                <v-icon dark>mdi-pencil</v-icon>
                            </v-btn> -->

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

            <v-dialog v-model="dialog" max-width="400" @click:outside="() => { this.$refs.form_entrega.reset() }">
                <v-card>
                    <v-card-title class="headline">Entregar Kit</v-card-title>
                    <v-card-text>
                        <v-form ref="form_entrega" v-model="valid_form">
                            <v-row>
                                <v-col cols="12">
                                    <small>Paciente: </small>
                                    <h2>{{ paciente.nombre }} {{ paciente.segundo_nombre }} {{ paciente.apellido }} {{ paciente.segundo_apellido }}</h2>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea :rules="[v => !!v || 'Campo obligatorio!']" v-model="entrega_medicamento.recibe" hide-details outlined rows="2" label="Nombre de quien recibe"></v-textarea>
                                </v-col>

                                <v-col cols="12">
                                    <v-textarea v-model="entrega_medicamento.comentarios" hide-details outlined rows="3" label="Comentarios"></v-textarea>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                            color="green darken-1"
                            text
                            @click="() => {

                                this.$refs.form_entrega.reset()
                                dialog = false

                            }"
                        >
                            Cancelar
                        </v-btn>

                        <v-btn
                            color="green darken-1"
                            text
                            @click="entregar()"
                        >
                            Aceptar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <Form :usuario="usuario" :obtener_detalle="obtener_detalle" :id_paciente="id_paciente" :show_dialog="show_dialog" @closeDialog="() => {
            obtener_detalle = false
            id_paciente = null
            show_dialog = false}" />
        
        </v-container>
    </div>
</template>

<script>

    import Form from '@/components/Pacientes/FormConsulta.vue'
    import Swal from 'sweetalert2'

    export default {
        components: {
            Form,
        },
        data(){
            return{
                busqueda: null,
                headers: [],
                items: [],
                campamentos: [],
                dialog: false,
                paciente: {},
                valid_form: true,
                entrega_medicamento: {
                    recibe: null,
                    comentarios: null
                },
                tab: null,
                campamento_select: null,
                page: 1,
                pageCount: null,
                usuario: null,
                show_dialog: false,
                obtener_detalle: false,
                id_paciente: null
            }
        },
        methods: {

            obtener_campamentos(){

                this.axios.get(process.env.VUE_APP_API_URL + 'datos_registro.php').then((response) => {
                    this.campamentos = response.data.campamentos
                })

            },
            obtener_pacientes(id_campamento){

                this.campamento_select = id_campamento

                let data = {
                    id_campamento: id_campamento
                }

                this.axios.post(process.env.VUE_APP_API_URL + 'obtener_constancias.php', data)
                .then((response) => {

                    this.headers = response.data.headers
                    this.items = response.data.items
                    
                })

            },
            atender(paciente){

                Swal.fire({
                    title: 'Entrega de Constancia',
                    text: "Una vez indicado esto no se podrá revertir!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Entregada!',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {

                    if (result.value) {

                        this.axios.post(process.env.VUE_APP_API_URL + 'constancia_entregada.php', paciente)
                        .then((response) => {
                            
                            if (response.data) {
                                
                                Swal.fire(
                                    'Excelente!',
                                    'La información del paciente a sido actualizada.',
                                    'success'
                                )
                            
                            }
                        })
                        
                    }
                })

            },
            entregar(){

                this.$refs.form_entrega.validate()

                if (this.valid_form) {

                    this.entrega_medicamento.id_paciente = this.paciente.id

                    this.axios.post(process.env.VUE_APP_API_URL + 'entregar_kit.php', this.entrega_medicamento)
                    .then((response) => {
                        
                        if (response.data) {
                            
                            Swal.fire(
                                'Excelente!',
                                'Se ha registrado la entrega del kit.',
                                'success'
                            ).then(() => {

                                this.$refs.form_entrega.reset()
                                this.obtener_pacientes(this.campamento_select)
                                this.dialog = false

                            })
                        
                        }
                    })
                    
                }

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
            detalle(item){

                this.obtener_detalle = true
                this.id_paciente = item.id
                this.show_dialog = true

            },
        },
        mounted(){

            let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))
            this.tab = usuario.id_campamento - 1
            this.campamento_select = usuario.id_campamento

            this.detalle_usuario()
            this.obtener_campamentos()
            this.obtener_pacientes(this.campamento_select)

            this.$nextTick(function () {
                window.setInterval(() => {
                    this.obtener_pacientes(this.campamento_select)
                },5000);
            })

        }
    }
</script>