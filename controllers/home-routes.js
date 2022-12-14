const router = require("express").Router();
const { Post, Comment, User } = require("../models/");

// get all posts for homepage
router.get("/", async (req, res) => {
  try {
    // we need to get all Posts and include the User for each (change lines 8 and 9)
    // *DONE
    const postData = await Post.findAll({
      attributes: { exclude: ["user_id", "updatedAt"] },
      include: [
        { model: User, attributes: { exclude: ["password", "createdAt"] } },
        { model: Comment },
      ],
    });

    // serialize the data
    // *DONE
    const posts = postData.map((post) => post.get({ plain: true }));

    // we should render all the posts here
    // *DONE
    res.render("all-posts", {
      payload: { posts, session: req.session },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get single post
router.get("/post/:id", async (req, res) => {
  try {
    // what should we pass here? we need to get some data passed via the request body (something.something.id?)
    // change the model below, but not the findByPk method.
    // *DONE
    const postData = await Post.findByPk(req.params.id, {
      // helping you out with the include here, no changes necessary
      attributes: {
        exclude: ["user_id", "updatedAt"],
      },

      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt"],
          },
        },
        {
          model: Comment,
          include: {
            model: User,
            attributes: { exclude: ["password"] },
          },
        },
      ],
    });

    if (postData) {
      // serialize the data
      const post = postData.get({ plain: true });
      // which view should we render for a single-post?
      // *DONE
      res.render("single-post", {
        payload: { posts: [post], session: req.session },
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// giving you the login and signup route pieces below, no changes needed.
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("signup");
});

module.exports = router;
