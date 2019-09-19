<template>
	<main class="website-main" v-if="event">
		<div class="website-container">
			<header class="event">
				<div class="event-top">
					<h2 class="event-top-title">{{event.name}}</h2>
					<span class="event-top-date">{{event.date}}</span>
				</div>
				<p class="event-description">{{event.description}}</p>
			</header>
			<section class="stats">
				<div class="stats-table">
					<header class="website-header">
						<h3 class="title is-4">Statystyki graczy</h3>
					</header>
					<div class="table-responsive">
						<table class="table-panel">
							<thead>
							<tr>
								<th>lp.</th>
								<th>Nazwisko i imię</th>
								<th>Dzielnica/wieś</th>
								<th>Liczba punktów</th>
							</tr>
							</thead>
							<tbody v-if="event.players">
							<tr :key="index" v-for="(player, index) in event.players">
								<th>{{ index + 1 }}</th>
								<th>{{ player.player.name }}</th>
								<th>{{ player.player.settlement }}</th>
								<th>{{ player.points }} pkt</th>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div class="stats-table">
					<header class="website-header">
						<h3 class="title is-4">Statystyki dzielnic/wsi</h3>
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
							<tr v-for="(item,index) in event.settlementScores" :key="index">
								<th>{{ index + 1 }}</th>
								<th>{{ item.key }}</th>
								<th>{{ item.value }} pkt</th>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
			</section>
			<section class="event-lightbox">
				<header class="event-lightbox-title">
					<h3>Galeria zdjęć</h3>
				</header>
				<p class="no-img" v-if="!event.medias">Brak zdjęć</p>
				<lightbox v-if="event.imageUrls" class="event-lightbox-thumbnail" :thumbnail="event.medias[0]" :images="event.medias">
					<lightbox-default-loader slot="loader"/>
				</lightbox>
			</section>
		</div>
		<Footer></Footer>
	</main>
</template>

<script>
import event from '../../GraphQL/Queries/Events/event.graphql'
export default {
	props: ['id'],
	name: "EventDetails",
	apollo:{
		event: {
			query()
			{
				return event
			},
			variables(){
				return{
					id: this.id
				}
			}
		}
	}
}
</script>

<style lang="scss" src="./EventDetails.scss" />