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
                  <span class="file-label">
                    Dodaj zdjęcie
                  </span>
                </span>
              </label>
            </div>
          </div>
          <div class="attachments" v-if="images || event.imageUrls">
            <div @click="removeImage(index)" class="attachments-image" v-for="(image,index) in images" :key="index">
              <img :src="image"/>
            </div>
            <div @click="removeUrl(index)" class="attachments-image" v-for="(url,index) in event.imageUrls" :key="index + 'n'">
              <img :src="url"/>
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
                      <select v-model="currentPlayer.name">
                        <option value="" disabled selected>Wybierz zawodnika</option>
                        <option v-for="player in players" :key="player.id">{{player.name}}</option>
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
              <tr v-for="(player, index) in event.players" :key="index">
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
      <button class="button is-danger" @click="handleSubmit">Edytuj imprezę</button>
      <button class="button" @click="goBack">Anuluj</button>
    </div>
  </section>
</template>

<script>

export default {
  name: "UpdateEvent",
  props: ['id'],
  data() {
    return {
      event: {
        name: '',
        description: '',
        date: '',
        players: [],
        images: [],
        season: ''
      },
      imagesToRemove: [],
      files: [],
      currentPlayer: {
        name: '',
        points: ''
      },
      images: [],
      alertMessage: null,
      sentProperly: false,
      alertTimeoutId: null
    }
  },
  computed: {
    players() {
      return this.$store.getters.players;
    }
  },
  methods: {
    async handleSubmit() {
      const valid = await this.$validator.validateAll();

      if (valid) {
        this.event.files = this.files;
        this.$store.dispatch('updateEvent',this.event);
        this.goBack();
      }
    },
    addPlayer() {
      const player = {
        name: this.currentPlayer.name,
        points: this.currentPlayer.points
      };

      if(this.event.players === undefined)
        this.event.players = [];

      this.event.players.push(player);
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
      let files = event.target.files || event.dataTransfer.files;
      this.files.push(files[0]);

      if (!files.length) {
        return;
      }

      this.createImage(files[0]);
    },
    createImage(file) {
      let image = new Image();
      let reader = new FileReader();
      let vm = this;

      reader.onload = (e) => {
        vm.images.push(e.target.result);
      };

      reader.readAsDataURL(file);
    },
    removeImage(index) {
      this.images.splice(index,1);
      this.files.splice(index,1);
    },
    removeUrl(index) {
      this.event.imageUrls.splice(index,1);
    }
  },
  created() {
    const event = this.$store.getters.event(this.$route.params.id);
    this.event = event;
  }
}

</script>

<style src="./UpdateEvent.scss" scoped />