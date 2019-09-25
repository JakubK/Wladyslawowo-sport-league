<template>
  <transition name="fade-normal">
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
        <Alert :sentProperly="sentProperly" :alertMessage="alertMessage"></Alert>
        <header class="modal-card-head">
          <p class="modal-card-title">Dodaj zawodnika</p>
          <button class="delete" aria-label="close" @click="closeModal"></button>
        </header>
        <section class="modal-card-body">
          <form class="form">
            <div class="field">
              <label class="label" for="name">Nazwisko lub imię</label>
              <div class="control">
                <input v-validate="'required'" data-vv-delay="250" name="name" class="input" id="name" type="text" placeholder="Jan Kowalski" v-model="player.name">
              </div>
              <transition name="fade-left">
                <p class="help is-danger" v-if="errors.has('nazwa')">{{errors.first('nazwa')}}</p>
              </transition>
            </div>
            <div class="field">
              <label class="label" for="settlement">Dzielnica lub wieś</label>
              <div class="control">
                <div class="select">
                  <select id="settlement" v-validate="'required'" data-vv-delay="250" name="settlement" placeholder="Osiedle/Dzielnica" v-model="settlement">
                    <option value="" disabled selected>Wybierz osiedle</option>
                    <option v-for="settlement in settlements" :key="settlement.id">{{settlement.name}}</option>
                  </select>
                </div>
                <transition name="fade-left">
                  <div class="help is-danger" v-if="errors.has('settlement')">{{errors.first('settlement')}}</div>
                </transition>
              </div>
            </div>
            <div class="field">
              <div class="file has-name">
                <label class="file-label">
                  <input class="file-input" type="file" @change="onFileSelected" accept="image/*">
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fa fa-cloud-upload-alt"></i>
                    </span>
                    <span class="file-label">Dodaj zdjęcie</span>
                  </span>
                  <br>
                </label>
              </div>
            </div>
            <div v-if="displayImage">
              <img class="attachment-image" :src="displayImage"/>
            </div>
          </form>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-danger" @click="handleSubmit">Zapisz</button>
          <button class="button" @click="closeModal">Anuluj</button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "AddPlayer",
  data() {
    return {
      player: {
        name: "",
        settlement: "",
        settlementId: '',
      },
      settlement: '',
      image: '',
      displayImage: '',
      alertMessage: null,
      sentProperly: false,
      alertTimeoutId: null
    }
  },
  methods: {
    async handleSubmit() {
      clearTimeout(this.alertTimeoutId);
      const valid = await this.$validator.validateAll();

      if (valid) {
        this.player.settlement = this.settlement;
        this.player.settlementId = this.settlementId(this.player.settlement);
        this.$store.dispatch('addPlayer', this.player, this.image);

        this.sentProperly = true;
        this.alertMessage = "Pomyślnie dodano nowego gracza"
        this.$validator.reset();
      } else {
        this.sentProperly = false;
        this.alertMessage = "Wypełnij pola";
      }

      this.alertTimeoutId = setTimeout(() => {
        this.alertMessage = undefined;          
      }, 3000);
    },
    onFileSelected(event) {
      this.image = event.target.files[0];

      let files = event.target.files || event.dataTransfer.files;

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
        vm.displayImage = e.target.result;
      };

      reader.readAsDataURL(file);
    },
    closeModal() {
      this.$store.dispatch('closeModal');
    },
    settlementId(settlementName)
    {
      for(let i = 0;i < this.settlements.length;i++)
      {
        if(this.settlements[i].name == settlementName)
        {
          return this.settlements[i].id;
        }
      }
    },
  },
  computed: {
    settlements() {
      return this.$store.getters.dashboardSettlements;
    }
  },
  created(){
    this.$store.dispatch("dashboardSettlements");
  }
}

</script>