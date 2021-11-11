import {  Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';


import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';
import * as ShoppingListActions from "../shopping-list/store/shopping-list.actions";
import * as fromShoppingList from "../shopping-list/store/shopping-list.reducer";


@Injectable()
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe('Chorizo & mozzarella gnocchi bake', 
  //               'Chorizo & mozzarella gnocchi bake',
  //               'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=768,574'
  //               , [new Ingredient('Potato', 2),
  //                   new Ingredient('Lemon', 3)]),
  //   new Recipe('Grilled Sweet Potatoes',
  //               'Slices of sweet potatoes grilled.',
  //               'https://www.simplyrecipes.com/thmb/OCi18J2V8OeKDFV3FxoeKvgq74E=/1423x1067/smart/filters:no_upscale()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2012__07__grilled-sweet-potatoes-horiz-a-1600-7c8292daa98e4020b447f0dc97a45cb7.jpg',
  //               [new Ingredient('Salt', 2),
  //                   new Ingredient('Chicken', 3)])
  // ]

  private recipes: Recipe[] =[];

  constructor(private shoppingListService: ShoppingListService,
              private store: Store<fromShoppingList.AppState>) { };

  getRecipes(){
    return this.recipes.slice();
  };

  addIngredientsToShoppingList(ingredients: Ingredient[]){
    // this.shoppingListService.addListIngredient(ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice())
  }

  getRecipe(index: number){
    return this.recipes[index];
  }

  addRecipe(newRecipe: Recipe){
    this.recipes.push(newRecipe);
    this.recipeChanged.next(this.recipes.slice())

  }

  updateRecipe(index: number, newRecipe: Recipe){
    this.recipes[index]= newRecipe;
    this.recipeChanged.next(this.recipes.slice())
  }

  deleteRecipe(index: number){
    this.recipes.splice(index,1);
    this.recipeChanged.next(this.recipes.slice())
  }



}
