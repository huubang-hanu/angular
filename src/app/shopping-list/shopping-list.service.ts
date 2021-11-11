
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

export class ShoppingListService {
  ingredientChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();


  ingredients: Ingredient[] = [
    new Ingredient('Apple', 5),
    new Ingredient('Tomato', 5)
  ];
  constructor() { }

  getIngredients (){
    return this.ingredients.slice();
  }

  getIngredient(index:number){
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient){
    this.ingredients.push(ingredient);
    this.ingredientChanged.next(this.ingredients.slice());
  }

  updateIngredient(index: number, newIngredient: Ingredient){
    this.ingredients[index] = newIngredient;
    this.ingredientChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number){
    this.ingredients.splice(index,1);
    this.ingredientChanged.next(this.ingredients.slice())
  }

  // addListIngredient(ingredients: Ingredient[]){
  //     for (const ingredient of ingredients) {
  //       this.addIngredient(ingredient);
  //     }
  // }

  addListIngredient(ingredients: Ingredient[]){
    this.ingredients.push(...ingredients); 
    this.ingredientChanged.next(this.ingredients.slice());
  }
}
