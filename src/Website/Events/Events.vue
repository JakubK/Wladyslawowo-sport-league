<template>
	<main class="website-main">
		<div class="website-container">
			<header class="website-header">
				<h1 class="title is-3">Imprezy</h1>
			</header>
			<div class="table-responsive">
				<table class="table-panel">
					<thead>
					<tr>
						<th>lp.</th>
						<th>Nazwa imprezy</th>
						<th>Data</th>
						<th>Liczba zawodników</th>
					</tr>
					</thead>
					<tbody class="table-body">
					<tr v-for="(event, index) in events" :key="index" @click="$router.push(`/events/${event.id}`)" :aria-label="event.name" :title="event.name">
						<th>{{index +1}}</th>
						<th>{{event.name}}</th>
						<th>{{event.date}}</th>
						<th v-if="event.players">{{event.players.length}}</th>
						<th v-else>0</th>
					</tr>
					</tbody>
				</table>
			</div>
		</div>
		<Footer></Footer>
	</main>
</template>

<script>
import events from '../../GraphQL/Queries/Events/events.graphql'
export default {
	name: "Events",
	apollo:{
		events: events
	}
}

</script>


