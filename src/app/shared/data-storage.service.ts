import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from "../auth/auth.service";



@Injectable({
    providedIn: "root"
})
export class DataStorageService{
    constructor(private http: HttpClient,
                private recipeService: RecipeService,
                private authService: AuthService){}

    saveRecipes(){
       const recipes = this.recipeService.getRecipes();
       this.http.put('https://angular-ifi-ecommerce-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json', 
                            recipes).subscribe(res =>{
                                console.log(res);
                                
                            })
    }

    fetchRecipes(){
        return this.http.get<Recipe[]>('https://angular-ifi-ecommerce-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json')
                        .pipe(
                            take(1),
                            map(recipes =>{
                                return recipes.map(recipe =>{
                                     return {...recipe, ingredients: recipe.ingredients ?  recipe.ingredients: []};
                                    });}),
                            tap(recipes => {this.recipeService.setRecipes(recipes)})
                        )
    }
}   