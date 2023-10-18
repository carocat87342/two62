import _ from 'underscore'

function categoryTitle (categoryId, buildingBlocksList) {
  let category = _.findWhere(buildingBlocksList, {id: categoryId})
  return category ? category.value : categoryId
}

function categoryColor (categoryId, buildingBlocksList) {
  let category = _.findWhere(buildingBlocksList, {id: categoryId})
  return category ? category.color : 'info'
}

export {
  categoryTitle,
  categoryColor
}
