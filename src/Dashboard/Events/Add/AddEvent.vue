<template>
  <section id="add-event">
    <Alert :sentProperly="sentProperly" :alertMessage="alertMessage"></Alert>
    <div class="event-container">
      <div class="event-column">
        <h2 class="event-column-title title is-5">Dane imprezy</h2>
        <form class="event-form">
          <div class="field">
            <label class="label">Nazwa imprezy</label>
            <div class="control">
              <input class="input" type="text" name="nazwa" v-validate="'required'" data-vv-delay="250" v-model="event.name" placeholder="Nazwa imprezy">
            </div>
            <transition name="fade-left">
              <p class="help is-danger" v-if="errors.has('nazwa')">{{errors.first('nazwa')}}</p>
            </transition>
          </div>
          <div class="field">
            <label class="label">Opis imprezy</label>
            <div class="control">
              <textarea class="textarea" name="opis" v-validate="'required'" data-vv-delay="250" v-model="event.description" placeholder="Opis wydarzenia"></textarea>
            </div>
            <transition name="fade-left">
              <p class="help is-danger" v-if="errors.has('opis')">{{errors.first('opis')}}</p>
            </transition>
          </div>
          <div class="field">
            <label class="label">Data imprezy</label>
            <div class="control">
              <input class="input" name="data" v-validate="'required'" data-vv-delay="250" type="date" v-model="event.date" >
            </div>
            <transition name="fade-left">
              <p class="help is-danger" v-if="errors.has('data')">{{errors.first('data')}}</p>
            </transition>
          </div>
          <div class="field">
            <label class="label">Sezon</label>
            <div class="control">
              <input class="input" name="season" v-validate="'required'" data-vv-delay="250" min="1" type="number" v-model="event.season" >
            </div>
            <transition name="fade-left">
              <p class="help is-danger" v-if="errors.has('season')">{{errors.first('season')}}</p>
            </transition>
          </div>
          <div class="field">
            <div class="file has-name">
              <label class="file-label">
                <input class="file-input" type="file" name="file" @change="onFileSelected" accept="image/*">
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fa fa-cloud-upload-alt"></i>
                  </span>
                  <span class="file-label">Dodaj zdjęcie</span>
                </span>
              </label>
            </div>
          </div>
          <div class="attachments" v-if="images">
            <div @click="removeImage(index)" class="attachments-image" v-for="(image,index) in images" :key="index">
              <img :src="image"/>
            </div>
          </div>
        </form>
      </div>
      <div class="event-column">
        <h2 class="event-column-title title is-5">Zawodnicy</h2>
        <div class="table-responsive">
          <table class="table is-bordered is-fullwidth">
            <thead class="panel-head">
              <tr>
                <th>LP</th>
                <th>Zawodnik</th>
                <th>Punkty</th>
                <th>Edycja</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>0</th>
                <th>
                  <div class="control">
                    <div class="select">
                      <select v-model="currentPlayer.name" @change="switchPlayerId($event)">
                        <option value="" disabled selected>Wybierz zawodnika</option>
                        <option :value="player.id" v-for="player in players" :key="player.id">{{player.name}}</option>
                      </select>
                    </div>
                  </div>
                </th>
                <th>
                  <div class="control">
                    <div class="control">
                      <input class="input" type="number" placeholder="Punkty" v-model="currentPlayer.points">
                    </div>
                  </div>
                </th>
                <th>
                  <div class="buttons">
                    <button class="button is-success is-5" @click="addPlayer">Dodaj</button>
                  </div>
                </th>
              </tr>
              <tr v-for="(player, index) in event.scores" :key="index">
                <th>{{index + 1}}</th>
                <th>{{player.name}}</th>
                <th>{{player.points}} pkt</th>
                <th>
                  <div class="buttons">
                    <button class="button is-danger is-5" @click="deletePlayer(index)">Usuń</button>
                  </div>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="buttons event-submit">
      <button class="button is-danger" @click="handleSubmit">Dodaj imprezę</button>
      <button class="button" @click="goBack">Anuluj</button>
    </div>
  </section>
</template>

<script>
import addEvent from '../../../GraphQL/Queries/Dashboard/addEvent.graphql'
import players from '../../../GraphQL/Queries/Dashboard/players.graphql'

export default {
  name: "AddEvent",
  data() {
    return {
      event: {
        name: '',
        description: '',
        date: '',
        scores: [],
        season: '1'
      },
      currentPlayer: {
        id: 0,
        name: '',
        points: ''
      },
      images: [],
      alertMessage: null,
      sentProperly: false,
      alertTimeoutId: null
    }
  },
  // computed: {
  //   players() {
  //     return this.$store.getters.players;
  //   }
  // },
  apollo:{
    players: players
  },
  methods: {
    switchPlayerId(e)
    {
      this.currentPlayer.id = e.target.value;
    },
    async handleSubmit() {
      clearTimeout(this.alertTimeoutId);

      const valid = await this.$validator.validateAll();
      if (valid) {
        // this.$store.dispatch('addEvent', this.event);
        let formData = new FormData();
        formData.append("graphql", `{ "query": "${addEvent.loc.source.body}", "variables": {
          "name" : "${this.event.name}"
        }}`)
        for(let i = 0;i < this.images.length;i++)
        {
          formData.append(i, this.images[i]);
        }

        fetch("http://localhost:5000/api/graphql", {
          method: 'post',
          body: formData
        });   

        this.sentProperly = true;
        this.alertMessage = "Pomyślnie dodano nową imprezę"
        this.$validator.reset();
      } else {
        this.sentProperly = false;
        this.alertMessage = "Wypełnij pola";
      }

      this.alertTimeoutId = setTimeout(() => {
        this.alertMessage = undefined;          
      }, 3000); 
    },
    addPlayer() {
      const player = {
        name: this.players.filter(x => x.id == this.currentPlayer.id)[0].name,
        points: this.currentPlayer.points,
        playerId: this.currentPlayer.id
      };

      if (this.event.scores === undefined) {
        this.event.scores = [];
      }

      this.event.scores.push(player);
    },
    deletePlayer(index) {
      this.event.players.splice(index, 1);
      this.event.settlementScores.splice(index, 1);
    },
    goBack() {
      this.$store.dispatch('closeModal');
    },
    dismissAlert() {
      this.alertMessage = null;
    },
    onFileSelected() {
      this.images.push(event.target.files[0]);

      let files = event.target.files || event.dataTransfer.files;
      if (!files.length)
        return;
      this.createImage(files[0]);
    },
    createImage(file) {
      let image = new Image();
      let reader = new FileReader();
      let vm = this;

      reader.onload = (e) => {
        //vm.images.push(e.target.result);
      };
      reader.readAsDataURL(file);
    },
    removeImage(index) {
      this.images.splice(index,1);
      this.images.splice(index,1);
    }
  }
}

</script>

<style src="./AddEvent.scss" scoped />