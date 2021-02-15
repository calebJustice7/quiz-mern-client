function getQuizStats(quizzes) {
    let objToReturn = {
        totalQuizzes: 0,
        totalLikes: 0,
        totalViews: 0,
        mostViewed: '',
        mostLiked: '',
        avgLikes: 0
    }

    objToReturn.totalQuizzes = quizzes.length;

    let totalLikes = 0;

    quizzes.forEach(quiz => {
        objToReturn.totalLikes += quiz.likes;
        objToReturn.totalViews += quiz.views;

        totalLikes += quiz.likes;
        
        if(objToReturn.mostViewed < quiz.views) {
            objToReturn.mostViewed = quiz.quizName;
        }
        if(objToReturn.mostLiked < quiz.likes) {
            objToReturn.mostLiked = quiz.quizName;
        }
    })
    objToReturn.avgLikes = totalLikes / objToReturn.totalQuizzes

    if(objToReturn.mostViewed === '') objToReturn.mostViewed = 'No quizzes have been taken'
    return objToReturn;
}

export default getQuizStats;