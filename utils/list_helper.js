const dummy = (blogs) => {
    const result = 1
    return result
  }
  
const totalLikes = (blogs) => {
    const reducer = (accumulator, currentValue) => accumulator + currentValue.likes;
    const result = blogs.reduce(reducer, 0)
    return result
}

  module.exports = {
    dummy,
    totalLikes
  }