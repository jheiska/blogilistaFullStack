const dummy = (blogs) => {
    const result = 1
    return result
  }
  
const totalLikes = (blogs) => {
    const reducer = (accumulator, currentValue) => accumulator + currentValue.likes;
    const result = blogs.reduce(reducer, 0)
    return result
}

const favoriteBlog = (blogs) => {
    const reducer = (accumulator, currentValue) => {
        if (accumulator.likes < currentValue.likes){
            return currentValue
        } else {
            return accumulator
        }
    }
    const result = blogs.reduce(reducer)
    return result
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }