Rails.application.routes.draw do
  namespace :api, defaults: { format: 'json' } do
    namespace :v1 do
      delete '/todos/destroy_all', to: 'todos#destroy_all'
      resources :todos, only: %i[index show create update destroy]
    end
  end
end
