#!/bin/bash

DOG_NAMES=("Buddy" "Charlie" "Max" "Milo" "Rocky" "Bailey" "Cooper" "Teddy" "Duke" "Oliver" "Leo" "Jack" "Toby" "Finn" "Zeus" "Louie" "Hunter" "Dexter" "Winston" "Murphy")
BREEDS=("Golden Retriever" "Labrador" "Poodle" "Bulldog" "Beagle" "Pug" "Rottweiler" "Dachshund" "Husky" "Shih Tzu" "Boxer" "Chihuahua" "Mastiff" "Great Dane" "Pointer" "Doberman" "Cocker Spaniel" "Pit Bull" "Border Collie" "Saint Bernard")

for i in {1..20}; do
  EMAIL="mock$i@example.com"
  DOG_NAME=${DOG_NAMES[$RANDOM % ${#DOG_NAMES[@]}]}
  BREED=${BREEDS[$RANDOM % ${#BREEDS[@]}]}

  curl -X POST http://localhost:3000/api/register \
       -H "Content-Type: application/json" \
       -d '{
         "password": "password",
         "profile": {
           "_email": "'"$EMAIL"'",
           "_dogName": "'"$DOG_NAME"'",
           "_breed": "'"$BREED"'",
           "_description": "A friendly and energetic dog",
           "_ownerName": "John Doe",
           "_imageLink": ""
         }
       }'
  
  echo "Sent request for $EMAIL with dog $DOG_NAME ($BREED)"
done
