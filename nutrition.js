function calculateNutrition() {

    let age = Number(document.getElementById("age").value)
    let feet = Number(document.getElementById("feet").value)
    let inches = Number(document.getElementById("inches").value)
    let weight = Number(document.getElementById("weight").value)
    let neck = Number(document.getElementById("neck").value)
    let waist = Number(document.getElementById("waist").value)
    let targetWeight = Number(document.getElementById("targetWeight").value)
    let activity = Number(document.getElementById("activity").value)
    let goal = document.getElementById("goal").value
    let sex = document.getElementById("sex").value

    let totalInches = (feet * 12) + inches
    let heightCM = totalInches * 2.54
    let weightKG = weight * 0.4536

    let BMR
    if (sex === "male") {
        BMR = (10 * weightKG) + (6.25 * heightCM) - (5 * age) + 5
    } else {
        BMR = (10 * weightKG) + (6.25 * heightCM) - (5 * age) - 161
    }

    let calories = BMR * activity
    if (goal === "lose") calories -= 500
    if (goal === "gain") calories += 300

    let protein = weight * 0.8
    let fats = (calories * 0.25) / 9
    let carbs = (calories - (protein * 4) - (fats * 9)) / 4

    let bodyFatText = "Not calculated"
    if (neck > 0 && waist > 0) {
        let bodyFat = 0

        if (sex === "male")
            bodyFat = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(totalInches) + 36.76

        if (sex === "female")
            bodyFat = 163.205 * Math.log10(waist + neck) - 97.684 * Math.log10(totalInches) - 78.387

        bodyFatText = Math.round(bodyFat) + "%"
    }

    let weeksToGoal = "N/A"

    if (targetWeight > 0) {
        let difference = targetWeight - weight

        if (goal === "lose")
            weeksToGoal = Math.abs(difference)

        if (goal === "gain")
            weeksToGoal = Math.abs(difference) * 2
    }

    document.getElementById("nutritionResult").innerHTML =
        "Daily Calories: " + Math.round(calories) + "<br>" +
        "Protein: " + Math.round(protein) + " g<br>" +
        "Fats: " + Math.round(fats) + " g<br>" +
        "Carbohydrates: " + Math.round(carbs) + " g<br><br>" +
        "Estimated Body Fat: " + bodyFatText + "<br>" +
        "Estimated Time To Reach Goal: " + weeksToGoal + " weeks"


    // ---------- RECIPES ----------

    const recipes = [

        {
            title: "Grilled Chicken Salad",
            image: "https://images.unsplash.com/photo-1604908177522-58d0a90a4c7c?auto=format&fit=crop&w=400&q=80",
            link: "https://www.allrecipes.com/recipe/279361/healthy-chicken-breast/"
        },

        {
            title: "Quinoa Veggie Bowl",
            image: "https://images.unsplash.com/photo-1612197521606-02c4f43dfd4f?auto=format&fit=crop&w=400&q=80",
            link: "https://www.eatingwell.com/recipe/276332/quinoa-veggie-bowl/"
        },

        {
            title: "Salmon and Vegetables",
            image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=400&q=80",
            link: "https://www.allrecipes.com/recipe/240208/salmon-with-steamed-vegetables/"
        },

        {
            title: "Chicken Burrito Bowl",
            image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=400&q=80",
            link: "https://www.eatingwell.com/recipe/250222/chicken-burrito-bowl/"
        },

        {
            title: "Avocado Tuna Salad",
            image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80",
            link: "https://www.allrecipes.com/recipe/258844/avocado-tuna-salad/"
        },

        {
            title: "Greek Chickpea Salad",
            image: "https://images.unsplash.com/photo-1604908177520-4329c5a56f7d?auto=format&fit=crop&w=400&q=80",
            link: "https://www.eatingwell.com/recipe/276923/mediterranean-chickpea-salad/"
        }

    ]


    const container = document.getElementById("recipeContainer")

    container.innerHTML = ""


    recipes
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .forEach(r => {

            const card = document.createElement("div")

            card.style.border = "1px solid #ccc"
            card.style.padding = "10px"
            card.style.width = "200px"
            card.style.textAlign = "center"


            const img = document.createElement("img")

            img.src = r.image
            img.style.width = "100%"
            img.style.height = "auto"
            img.style.borderRadius = "5px"


            const title = document.createElement("p")

            title.innerHTML =
                `<a href="${r.link}" target="_blank">${r.title}</a>`


            card.appendChild(img)
            card.appendChild(title)

            container.appendChild(card)

        })

}