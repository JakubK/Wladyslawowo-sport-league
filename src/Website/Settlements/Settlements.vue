<template>
	<main class="website-main">
		<div class="website-container">
			<header class="website-header">
				<h1 class="title is-3">Dzielnice i wsie</h1>
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
					<tbody class="table-body">
					<tr v-for="(settlement, index) in settlements" :key="index" @click="$router.push(`/settlements/${settlement.id}`)" :aria-label="settlement.name" :title="settlement.name">
						<th>{{index +1}}</th>
						<th>{{settlement.name}}</th>
						<th>{{settlement.points}} pkt</th>
					</tr>
					</tbody>
				</table>
			</div>
		</div>
		<Footer></Footer>
	</main>
</template>

<script>
import settlements from '../../GraphQL/Queries/Settlements/settlements.graphql'

export default {
	name: "Settlements",
	apollo:{
		settlements: settlements
	}
}

</script>