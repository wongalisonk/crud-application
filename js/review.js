$(document).ready(function() {
    // Initialize Parse app
    Parse.initialize("NOOP47jHohZp9tXrK9HuPevJB6rEG6KwozATm1b0", "2gjdy673ofisBaa5Mjyzc8YgiiCrAr7inXC2ZQrV");
   
    // Create new sub-class of Parse.Object
    var Review = Parse.Object.extend('Review');
   
    // Create new instance of the Parse.Object
    var review = new Review();
   
    // Set up a new query for Review class
    var query = new Parse.Query(Review);
   
    // Set max number of stars for review
    $('#star').raty({
        numberMax: 5
    });
   
    // Click event when form is submitted
    $('form').submit(function() {
       
        // For each input element, set a property of the new instance equal to the input's value
        $(this).find('#title, #body').each(function() {
            review.set($(this).attr('id'), $(this).val());
            $(this).val('')
        });
       
        review.set('upVote', 0);
        review.set('downVote', 0);
       
        var star = $('#star').raty('score');
        review.set($('#star').attr('id'), star);
       
        // After setting each property, save the new instance back to the database
        review.save(null, {
            success: getData
        });
    });
   
    // Function to get data
    var getData = function() {
       
        // Sets parameters for queries
        query.exists('title');
        query.descending('createdAt');
       
        /* Execute the query using ".find".  When successful:
        - Pass the returned data into the buildList function
        */
        query.find({
            success: buildList
        });
    }
   
    // A function to build the list
    var buildList = function(data) {
        avgRate = 0;
        totalRate = 0;
        reviews = 0;
       
        // Empty out the ordered list
        $('ol').empty();
        // Loop through the data, and pass each element to the addItem function
        data.forEach(function(d) {
            addItem(d);
        });
       
        // Gets the average rating
        avgRate = totalRate/reviews;
       
        // Sets the stars of the average rating
        $('#avg').raty({
            numberMax:5,
            readOnly: true,
            noRatedMsg: "No product reviews yet!",
            half: true,
            score: avgRate
        });
       
    }
   
    // Function takes in an item, adds it to the screen
    var addItem = function(item) {
        // Get parameters (title, body, star, and createdAt) from the data item passed to the function
        var title = item.get('title');
        var review = item.get('body');
        var rate = item.get('star');
        var date = item.get('createdAt');
        var upVote = item.get('upVote');
        var downVote = item.get('downVote');
        var timeDate = String(date).substring(0, 15);
       
        reviews++;
        totalRate += rate;

        // Creates a div for each review
        var div = $('<div id="reviewDiv"></div>');
       
        // Append the div
        $('ol').append(div);
       
        // Sets the title of the review to the div
        var rTitle = $('<h2></h2>');
        rTitle.text(title);
       
        // Adds the content or review to the div
        var rReview = $('<p></p>')
        rReview.text(review);
       
        // Adds the title to the div
        div.append(rTitle);
       
        // Adds the rating using stars to the div
        $('div:last').raty({
            readOnly: true,
            score: rate
        });
        // Adds the content or review to the div
        div.append(rReview);
        // Adds the time posted on the div
        div.append("Posted on " + timeDate + "<br>");
       
        // Creates the up vote and down vote buttons
        var up = $('<button id="up"><i class="fa fa-thumbs-o-up"></i></button>')
        var down = $('<button id="down"><i class="fa fa-thumbs-o-down"></i></button>');
       
        // Changes the value of vote up by one
        up.click(function() {
            query.get(item.id, {
                success: function(review) {
                    review.increment('upVote')
                    review.save(null, {
                        success: getData
                    });
                }
            })
        })
       
        // Changes the value of the vote down by one
        down.click(function() {
            query.get(item.id, {
                success: function(review) {
                    review.increment('downVote')
                    review.save(null, {
                        success: getData
                    });
                }
            })
        })
 
        var totalVote = upVote + downVote;
       
        // Adds the buttons to the div
        div.append(up);
        div.append(down);
        div.append(" " + upVote + " out of " + totalVote + " people found this useful. ")
       
        // Creates the button to delete the review
        var button = $('<button><i class="fa fa-times"></i></button>');
       
        // Removes the review on click
        button.on('click', function() {
            item.destroy({
                success: getData
            })
        });
       
        // Adds the button to the review
        div.append(button);
    }
   
    getData();
});