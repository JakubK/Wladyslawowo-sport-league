<template>
	<main class="website-container">
		<section class="description">
			<h2 class="description-header title is-3">{{ settlement.name }}</h2>
			<figure class="description-img" v-if="settlement.imageUrl">
				<img :src="settlement.imageUrl" :alt="settlement.name" />
			</figure>
			<div class="description-content">
				<p class="description-content-text">{{ settlement.description }}</p>
				<p class="description-content-text">Liczba zawodników: <b>{{ settlement.playerCount }}</b></p>
			</div>
		</section>
		<section class="stats">
			<div class="stats-table">
				<header class="website-header">
					<h3 class="title is-4">Gracze osiedla</h3>
				</header>
				<div class="table-responsive">
					<table class="table-panel">
						<thead>
							<tr>
								<th>lp.</th>
								<th>Nazwisko i imię</th>
								<th>Liczba punktów</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(player, index) in settlementPlayers" :key="index">
								<th>{{ index + 1 }}</th>
								<th>{{ player.player.name }}</th>
								<th>{{ player.points }}</th>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="stats-table">
				<header class="website-header">
					<h3 class="title is-4">Ranking dzielnic/wsi</h3>
				</header>
				<div class="table-responsive">
					<table class="table-panel">
						<thead>
							<tr>
								<th>lp.</th>
								<th>Nazwa dzielnicy lub wsi</th>
								<th>Liczba punktów</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item, index) in settlements" :key="index" :class="{ 'is-active' : item.id === settlement.id}">
								<th>{{ index + 1 }}</th>
								<th>{{ item.name }}</th>
								<th>{{ item.points }} pkt</th>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div v-if="topSeason > 0" class="seasons">
				<header class="website-header seasons-header">
					<h3 class="seasons-title title is-4">Sezony</h3>
					<div class="season-controls">
						<button @click="setSeason(season-1)">
							<svg aria-hidden="true" data-prefix="fas" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg"
							 viewBox="0 0 320 512" class="svg-inline--fa fa-chevron-left fa-w-10 fa-3x">
								<path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path>
							</svg>
						</button>
						<span>{{ season }}</span>
						<button @click="setSeason(season+1)">
							<svg aria-hidden="true" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg"
							 viewBox="0 0 320 512" class="svg-inline--fa fa-chevron-right fa-w-10 fa-2x">
								<path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path>
							</svg>
						</button>
					</div>
				</header>
				<table v-if="seasonData.length > 0" class="table-panel">
					<thead>
						<tr>
							<th>LP</th>
							<th>Gracz</th>
							<th>Nazwa imprezy</th>
							<th>Data</th>
							<th>Ilość punktów</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(event, index) in seasonData" :key="index">
							<th>{{ index + 1 }}</th>
							<th>{{ event.player }}</th>
							<th>{{ event.name }}</th>
							<th>{{ event.date }}</th>
							<th>{{ event.points }} pkt</th>
						</tr>
					</tbody>
				</table>
				<div v-else>
					Brak aktywności w tym sezonie dla tego gracza
				</div>
			</div>
		</section>
	</main>
</template>

<script>
	export default {
		props: ['id'],
		name: "SettlementDetails",
		data()
		{
			return{
			season: null,
			maxSeason: null
			};
		},
		computed: {
			settlement() {
				return this.$store.getters.briefSettlementById(this.id);
			},
			settlements() {
				return this.$store.getters.settlements;
			},
			settlementPlayers() {
				return this.$store.getters.playerSettlements(this.id);
			},
			seasonData()
			{
				return this.$store.getters.settlementSeasonData(this.id, this.season);
			},
			topSeason()
			{
				return this.$store.getters.settlementTopSeason(this.id);
			}
		},
		methods:
		{
			setSeason(targetVal)
			{
				if(targetVal >= 1 && targetVal <= this.topSeason)
				{
					this.season = targetVal;
				}
			}
		},
		mounted()
		{
			this.maxSeason = this.topSeason;
			this.setSeason(this.topSeason);
		}
	}
</script>