# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

SAMPLE_TODOS = [
  {
    name: 'Going around the world'
  },
  {
    name: 'graduating from college'
  },
  {
    name: 'publishing a book'
  },
  {
    name: 'Create a compost pile'
  },
  {
    name: 'Make own LEGO creation'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Watch a classic movie'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Buy a new house decoration'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Bake pastries for me and neighbor'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Go see a Broadway production'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Take cat on a walk'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Invite some friends over for a game night'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Invite some friends over for a game night'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Invite some friends over for a game night'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Invite some friends over for a game night'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Do something..'
  },
  {
    name: 'Invite some friends over for a game night'
  }
]

SAMPLE_TODOS.each do |todo|
  Todo.create(todo)
end