class Player {
  constructor(name, color) {
    this.name = name,
    this.color = color,
    this.resources = new Map([
      ['grain', 0], 
      ['wool', 0], 
      ['ore', 0], 
      ['lumber', 0], 
      ['brick', 0], 
      ['card', 0]
      ]);
  }

  AddResources(resources) {
    for (const resource of resources) {
      this.resources.set(resource, this.resources.get(resource) + 1);
    }
  }

  RemoveResources(resources, all=false) {
    for (const resource of resources) { 
      this.resources.set(resource, all ? 0 : this.resources.get(resource) - 1);
    }
  }
}


class Bank {
  constructor() {
    this.resources = new Map([
      ['lumber', 19],
      ['brick', 19],
      ['wool', 19], 
      ['grain', 19], 
      ['ore', 19]
      ]);
    this.devCards = 25;
    // this.devCards = new Map([
    //   ['']
    // ])

  }

  GetResource(resource) {
    return this.resources.get(resource);
  }

  GetDevCardCount() {
    return this.devCards;
  }

  AddResources(resources) {
    for (const resource of resources) {
      this.resources.set(resource, this.resources.get(resource) + 1);
    }
  }

  RemoveResources(resources) {
    for (const resource of resources) {
      this.resources.set(resource, this.resources.get(resource) - 1);
    }
  }

  RemoveDevCard(devCard) {
    this.devCards--;
  }
}


const PURCHASES = new Map([
  ['road', ['brick', 'lumber']], 
  ['settlement', ['brick', 'lumber', 'grain', 'wool']], 
  ['development card', ['grain', 'wool', 'ore']], 
  ['city', ['grain', 'grain', 'ore', 'ore', 'ore']]
  ]);

class Game {
  constructor() {
    this.bank = new Bank();
    this.players = new Map(); 
  }

  AddPlayer(name, color) {
    this.players.set(name, new Player(name, color));
  }

  PlayerReceivedResources(player, resources) {
    this.bank.RemoveResources(resources);
    this.players.get(player).AddResources(resources);
  }

  PlayerPurchased(player, purchase) {
    let resources = PURCHASES.get(purchase);
    this.players.get(player).RemoveResources(resources);
    this.bank.AddResources(resources);
    if (purchase === 'development card') {
      this.bank.RemoveDevCard(purchase);
    }
  }

  PlayerDiscarded(player, resources) {
    this.players.get(player).RemoveResources(resources);
    this.bank.AddResources(resources);
  }

  PlayerStole(thief, victim, resource) {
    this.players.get(victim).RemoveResources([resource]);
    this.players.get(thief).AddResources([resource]);
  }

  PlayerStoleAll(player, resource, amount) {
    for (const player of this.players) {
      player.RemoveResources(resource, all=true);
    }
    this.players.get(player).AddResources([resource] * amount);
  }

  PlayerTraded(offerer, receiver, givenResources, receivedResources) {
    this.players.get(offerer).RemoveResources(givenResources);
    this.players.get(receiver).RemoveResources(receivedResources);
    this.players.get(offerer).AddResources(receivedResources);
    this.players.get(receiver).AddResources(givenResources);
  }

  PlayerTradedWithBank(user, givenResources, receivedResources) {
    this.players.get(user).RemoveResources(givenResources);
    this.bank.RemoveResources(receivedResources);
    this.players.get(user).AddResources(receivedResources);
    this.bank.AddResources(givenResources);
  }
}