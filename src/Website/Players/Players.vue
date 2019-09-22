<template>
	<main class="website-main">
		<div class="website-container">
			<header class="website-header">
				<h1 class="title is-3">Zawodnicy</h1>
			</header>
			<div class="table-responsive">
				<table class="table-panel">
					<thead>
					<tr>
						<th>lp.</th>
						<th>Nazwisko i imię</th>
						<th>Dzielnica lub wieś</th>
						<th>Liczba punktów</th>
					</tr>
					</thead>
					<tbody class="table-body">
					<tr v-for="(player, index) in players" :key="index" @click="$router.push(`/players/${player.id}`)" :aria-label="player.name" :title="player.name">
						<th>{{index +1}}</th>
						<th>{{player.name}}</th>
						<th>{{ player.settlement }}</th>
						<th>{{player.points}} pkt</th>
					</tr>
					</tbody>
				</table>
			</div>
		</div>
		<Footer></Footer>
	</main>
</template>

<script>
	export default {
		name: "Players",
		created(){
			this.$store.dispatch("players");
		},
		computed:{
			players(){
				return this.$store.getters.players;
			}
		}
	}

</script>