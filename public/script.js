if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("DOMContentLoaded", () => {
  if (window.location.hash) {
    const urlWithoutHash = window.location.href.replace(/#.*$/, "");
    history.replaceState(null, "", urlWithoutHash);
  }

  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 10);
});

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

//section behavior
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        const el = entry.target;

        if (entry.isIntersecting) {
          el.style.transition =
            "opacity 1.4s ease-out, transform 0.8s ease-out";
          el.style.transitionDelay = `${index * 0.2}s`;
          el.style.opacity = 1;
          el.style.transform = "translateY(0)";
        } else {
          el.style.transition =
            "opacity 0.6s ease-out, transform 0.6s ease-out";
          el.style.transitionDelay = "0s";
          el.style.opacity = 0;
          el.style.transform = "translateY(20px)";
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  sections.forEach((section) => {
    section.style.opacity = 0;
    section.style.transform = "translateY(40px)";
    observer.observe(section);
  });
});

//header animation
let lastScrollTop = 0;
const header = document.querySelector("header");
let hideTimeout;

window.addEventListener("scroll", () => {
  if (suppressHeaderUpdate) return;

  const currentScroll =
    window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll <= 0) {
    header.style.top = "0";
    return;
  }

  if (currentScroll > lastScrollTop) {
    // scroll down
    header.style.top = "-90px";
  } else {
    // scroll up
    header.style.top = "0";
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

header.addEventListener("mouseenter", () => {
  clearTimeout(hideTimeout);
  header.style.top = "0";
});

header.addEventListener("mouseleave", () => {
  hideTimeout = setTimeout(() => {
    if (window.scrollY > 0) {
      header.style.top = "-90px";
    }
  }, 500);
});

//header nav-links active

document.querySelectorAll(".logo").forEach((logo) => {
  logo.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    flipCard?.(false);
  });
});

const linkLogo = document.querySelectorAll(".logo, .logo-link");

function updateLogoActiveState() {
  const isAtTop = window.scrollY <= 100;
  linkLogo.forEach((logo) => {
    logo.classList.toggle("active", isAtTop);
  });
}

window.addEventListener("DOMContentLoaded", updateLogoActiveState);

window.addEventListener("scroll", updateLogoActiveState);

const headerLinks = document.querySelectorAll('nav a[href^="#"]');
const pageSections = document.querySelectorAll("section[id]");
const logoLinks = document.querySelectorAll(".logo");

window.addEventListener("scroll", () => {
  let currentSectionId = "";

  pageSections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSectionId = section.getAttribute("id");
    }
  });

  headerLinks.forEach((link) => {
    const href = link.getAttribute("href").replace("#", "");
    link.classList.toggle("active", href === currentSectionId);
  });

  if (!currentSectionId && window.scrollY <= 100) {
    logoLinks.forEach((logo) => logo.classList.add("active"));
  } else {
    logoLinks.forEach((logo) => logo.classList.remove("active"));
  }
});

//typing text (front card)
const roles = [
  "A BS Computer Engineering Fresh Graduate.",
  "An Aspiring Software Engineer.",
  "An Aspiring Web Developer.",
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingText = document.getElementById("typing-text");
const cursor = document.querySelector(".cursor");

function typeRole() {
  const currentRole = roles[roleIndex];
  const visibleText = currentRole.substring(0, charIndex);

  typingText.textContent = visibleText;

  if (!isDeleting && charIndex < currentRole.length) {
    charIndex++;
    setTimeout(typeRole, 100);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeRole, 50);
  } else {
    if (!isDeleting) {
      isDeleting = true;
      setTimeout(typeRole, 1500);
    } else {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeRole, 300);
    }
  }
}

window.addEventListener("DOMContentLoaded", typeRole);

//flip card logic
function flipCard(forceFlip = null) {
  const card = document.getElementById("contactCard");
  if (!card) {
    console.error("Element #contactCard not found");
    return;
  }

  if (forceFlip === true) {
    card.classList.add("flipped");
  } else if (forceFlip === false) {
    card.classList.remove("flipped");
  } else {
    card.classList.toggle("flipped");
  }
}

document.querySelectorAll('a[href="#contact"]').forEach((link) => {
  link.addEventListener("click", () => {
    setTimeout(() => {
      flipCard(true);
    }, 200);
  });
});

const contactSection = document.getElementById("contact");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        flipCard(false);
      }
    });
  },
  {
    threshold: 1,
  }
);

if (contactSection) {
  observer.observe(contactSection);
}

//form await/fetch
document.getElementById("sendButton").addEventListener("click", async (e) => {
  e.preventDefault();

  const form = document.getElementById("contactForm");
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const formStatus = document.getElementById("formStatus");

  formStatus.textContent = "";
  formStatus.style.color = "";

  // Validate input
  if (!name || !email || !message) {
    formStatus.textContent = "Please fill out all the fields!";
    formStatus.style.color = "red";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    formStatus.textContent = "Please enter a valid email address!";
    formStatus.style.color = "red";
    return;
  }

  try {
    const response = await fetch(
      "https://miguel-portfolio-h6k8.onrender.com/submit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      }
    );

    let result = {};
    try {
      result = await response.json();
    } catch (jsonError) {
      console.warn("Invalid JSON in response:", jsonError);
    }

    if (response.ok) {
      formStatus.textContent = "Message sent successfully!";
      formStatus.style.color = "green";
      form.reset();
    } else {
      formStatus.textContent = result?.error || "Something went wrong.";
      formStatus.style.color = "red";
    }
  } catch (error) {
    console.error("Submission error:", error);
    formStatus.textContent = "Network error.";
    formStatus.style.color = "red";
  }

  setTimeout(() => {
    formStatus.textContent = "";
    formStatus.style.color = "";
  }, 3000);
});

// image modal
function openModal(imageSrc) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");

  modal.style.display = "flex";
  modalImg.src = imageSrc;
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

window.onclick = function (event) {
  const modal = document.getElementById("imageModal");
  if (event.target === modal) {
    closeModal();
  }
};

//pdf modal
function openPDFModal(pdfPath) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = pdfPath.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  const modal = document.getElementById("pdfModal");
  const viewer = document.getElementById("pdfViewer");

  viewer.src = pdfPath;
  modal.style.display = "flex";
}

function closePDFModal() {
  const modal = document.getElementById("pdfModal");
  const viewer = document.getElementById("pdfViewer");

  viewer.src = "";
  modal.style.display = "none";
}

window.addEventListener("click", function (event) {
  const modal = document.getElementById("pdfModal");
  if (event.target === modal) {
    closePDFModal();
  }
});

//about

const aboutNavLinks = document.querySelectorAll(".about-links a");

const aboutInfo = {
  profile: {
    content: `
      <div class="tab-content">
        <p class="about-subtitle">Contact Number:</p>
        <p>09369333063 / 09943605438</p>
        <p class="about-subtitle"><br />Birthdate:</p>
        <p>November 6, 2002 (22 yrs. old)</p>
        <br />
        <p class="about-subtitle">Email Address:</p>
        <p>miguel.sp1106@gmail.com</p>
      </div>
    `,
  },
  education: {
    content: `
      <div class="tab-content">
        <p class="about-subtitle">Sto. Niño Academy</p>
        <p>Junior High School Diploma (2015 - 2019)</p>
        <br />
        <p class="about-subtitle">
          Bulacan State University - Laboratory High School
        </p>
        <p>Senior High School Diploma, STEM (2019 - 2021)</p>
        <br />
        <p class="about-subtitle">
          Bulacan State University - Meneses Campus
        </p>
        <p>Bachelor of Science in Computer Engineering (2021 - 2025)</p>
      </div>
    `,
  },
  certification: {
    content: `
      <div class="tab-content">
        <p class="about-subtitle">
          Cloud Management System Certified Engineer
        </p>
        <div class="view-btn">
          <p>Dahua Technology (2025 - 2027)</p>
          <button class="cert-btn" onclick="openModal('pics/CMS.jpg')">
            View Certificate
          </button>
        </div>
        <p class="about-subtitle">
          <br />Video Surveillance System Certified Engineer
        </p>
        <div class="view-btn">
          <p>Dahua Technology (2025 - 2027)</p>
          <button class="cert-btn" onclick="openModal('pics/VSSCE.jpg')">
            View Certificate
          </button>
        </div>
        <p class="about-subtitle">
          <br />Institute of Computer Engineers of the Philippines
        </p>
        <p>Member (2021 - 2025)</p>
      </div>
    `,
  },
};

aboutNavLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    aboutNavLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    const sectionId = link.getAttribute("href").replace("#", "");
    const titleElement = document.getElementById("aboutTitle");
    const textElement = document.getElementById("aboutText");
    const contentBox = document.querySelector(".about-content");
    const info = aboutInfo[sectionId];

    if (info && titleElement && textElement && contentBox) {
      // Trigger fade-out first
      contentBox.classList.remove("fade-in");
      contentBox.classList.add("fade-out");

      setTimeout(() => {
        textElement.innerHTML = info.content;

        contentBox.classList.remove("fade-out");
        contentBox.classList.add("fade-in");
      }, 400);
    }
  });
});

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector('a[href="#profile"]')?.classList.add("active");

  const defaultInfo = aboutInfo["profile"];
  if (defaultInfo) {
    document.getElementById("aboutTitle").textContent = defaultInfo.title;
    document.getElementById("aboutText").innerHTML = defaultInfo.content;
    document.querySelector(".about-content").classList.add("fade-in");
  }
});

//skills sect
document.addEventListener("DOMContentLoaded", () => {
  const tabTitles = document.querySelectorAll(".skills-title");
  const skillBoxes = document.querySelectorAll(".skills-box");
  const icons = document.querySelectorAll(".icon-logo");

  const skillDescriptions = {
    web: {
      html: {
        title: "HTML",
        text: "- Experienced in writing semantic, accessible, and responsive HTML structures.",
        progress: 80,
      },
      css: {
        title: "CSS",
        text: "- Used CSS as much as HTML to create refined styling for appealing web pages across all devices.",
        progress: 80,
      },
      js: {
        title: "JavaScript",
        text: "- Proficient in JavaScript for client-side interactivity and asynchronous operations. Continuously improving problem-solving and DOM manipulation skills.",
        progress: 55,
      },
      tailwind: {
        title: "TailwindCSS",
        text: "- Fundamental knowledge of Tailwind CSS, currently being learned to apply for my future projects.",
        progress: 30,
      },
      nodeJs: {
        title: "Node.js",
        text: "- Introductory understanding of Node.js for building backend services using JavaScript on the server side.",
        progress: 25,
      },
      express: {
        title: "Express",
        text: "- Learned the basics of creating web servers and API routes using Express with Node.js.",
        progress: 22,
      },
      mongodb: {
        title: "MongoDB",
        text: "- Basic experience using MongoDB through its cloud-hosted version, Atlas, primarily for simple data storage and integration subjected to this portfolio.",
        progress: 18,
      },
    },
    hardware: {
      c: {
        title: "C",
        text: "- Solid C foundation with hands-on experience in hardware-based projects.",
        progress: 40,
      },
      cpp: {
        title: "C++",
        text: "- Applied C++ knowledge through multiple Arduino hardware-software integration projects.",
        progress: 40,
      },
      python: {
        title: "Python",
        text: "- Fundamental Python knowledge with experience in a single project utilizing multiple libraries.",
        progress: 25,
      },
    },
  };

  const showFirstIconFor = (skill) => {
    const box = document.querySelector(`.skills-box[data-skill="${skill}"]`);
    if (!box) return;

    const firstIcon = box.querySelector(".icon-logo");
    if (firstIcon) {
      updateDescription(firstIcon);
    }
  };

  const activateTab = (skill) => {
    tabTitles.forEach((title) => {
      title.classList.toggle("active", title.dataset.skill === skill);
    });

    skillBoxes.forEach((box) => {
      const isActive = box.dataset.skill === skill;
      box.classList.toggle("active", isActive);
    });

    showFirstIconFor(skill);
  };

  const typeTitle = (element, text, speed = 60) => {
    return new Promise((resolve) => {
      element.textContent = "";
      let index = 0;
      const type = () => {
        if (index < text.length) {
          element.textContent += text.charAt(index++);
          setTimeout(type, speed);
        } else {
          resolve();
        }
      };
      type();
    });
  };

  const fadeOutParagraph = (element) =>
    new Promise((resolve) => {
      if (!element) return resolve();
      element.style.opacity = "0";
      element.style.transition = "opacity 0.3s ease";
      setTimeout(resolve, 300);
    });

  const fadeInParagraph = (element) => {
    element.style.opacity = "1";
    element.style.transition = "opacity 0.5s ease";
  };

  const updateDescription = async (icon) => {
    const skillId = icon.dataset.id;
    const skillType = icon.closest(".skills-box").dataset.skill;
    const displayArea = document.getElementById(`${skillType}-text`);
    const data = skillDescriptions[skillType][skillId];
    if (!data) return;

    const container = icon.closest(".article-container");
    container
      .querySelectorAll("article")
      .forEach((a) => a.classList.remove("active"));
    icon.closest("article").classList.add("active");

    const oldParagraph = displayArea.querySelector("p");
    const oldTitle = displayArea.querySelector("h3");

    if (oldParagraph) await fadeOutParagraph(oldParagraph);
    if (oldTitle) oldTitle.textContent = "";

    displayArea.innerHTML = `
      <div class="article-text active">
        <div class="text-content">
          <h3 id="typing-title"></h3>
          <p style="opacity: 0;">${data.text}</p>
        </div>
        ${
          data.progress !== undefined
            ? `<div class="radial-progress" style="--value: ${data.progress};">${data.progress}</div>`
            : ""
        }
      </div>
    `;

    function animateProgress(el, from, to, duration = 800) {
      let start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const value = from + ((to - from) * progress) / duration;
        const clamped = Math.max(0, Math.min(800, value));

        el.style.setProperty("--value", clamped.toFixed(1));
        el.textContent = `${Math.round(clamped)}%`;

        if ((to > from && clamped < to) || (to < from && clamped > to)) {
          requestAnimationFrame(step);
        } else {
          el.style.setProperty("--value", to);
          el.textContent = `${to}%`;
        }
      }

      requestAnimationFrame(step);
    }

    const radial = displayArea.querySelector(".radial-progress");
    if (radial && data.progress !== undefined) {
      animateProgress(
        radial,
        parseFloat(radial.style.getPropertyValue("--value") || 0),
        0,
        700
      );

      setTimeout(() => {
        animateProgress(radial, 0, data.progress, 800);
      }, 700);
    }

    const newTitle = displayArea.querySelector("#typing-title");
    const newParagraph = displayArea.querySelector("p");

    await typeTitle(newTitle, data.title, 70);
    fadeInParagraph(newParagraph);
  };

  // show first skill title
  activateTab("web");

  // skill title click events
  tabTitles.forEach((title) =>
    title.addEventListener("click", () => {
      const skill = title.dataset.skill;
      activateTab(skill);
    })
  );

  // icon click events
  icons.forEach((icon) =>
    icon.addEventListener("click", () => updateDescription(icon))
  );
});

//image stack
const yearMarkers = document.querySelectorAll(".year-marker");
const imageStack = document.getElementById("imageStack");
const timelineProgress = document.getElementById("timelineProgress");
let suppressHeaderUpdate = false;
let typingInterval = null;

imageStack.addEventListener("mouseenter", () => {
  suppressHeaderUpdate = true;
});

imageStack.addEventListener("mouseleave", () => {
  suppressHeaderUpdate = false;
});

function deleteText(element, speed = 200, callback) {
  let text = element.textContent;
  let i = text.length;

  const deletingInterval = setInterval(() => {
    element.textContent = text.substring(0, --i);
    if (i <= 0) {
      clearInterval(deletingInterval);
      if (callback) callback();
    }
  }, speed);
}

function typewriter(element, text, speed = 40) {
  if (typingInterval) {
    clearInterval(typingInterval);
    typingInterval = null;
  }

  element.textContent = "";
  let i = 0;

  typingInterval = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(typingInterval);
      typingInterval = null;
    }
  }, speed);
}

//project sect

const projectInfo = {
  2023: {
    title: "Arduino Based - Miniature Water Level Sensor",
    text: "This device monitors abrupt shift in water levels that uses an Arduino as its center and sensors such as the Water level sensor and a float switch to determine water level in a container. This project of ours has gathered 2nd place in a showcase within campus with votes coming from students from other courses.",
    year: "November 2023",
  },
  2024: {
    title: "Arduino Based - Interactive Game Console",
    text: "This game console is consist of 2 different games (mini quiz game and stick game) that uses buttons for respective controls alongside a reset button.",
    year: "Dember 2024",
  },
  2025: {
    title: "Portable Canine Scabies Detection Device for Dogs - Prototype",
    text: "This project is a prototype detection device that analyzes dog's skin pattern and temperature to determine whether the dog is infested with the mites. The device used a Raspberry Pi as its CPU and utilized a TensorFlow Lite and SQLite to handle small scale operations. The use of the machine learning library was backed up by 200 datasets of images with positive related dog cases.",
    year: "January - April 2025",
  },
  22025: {
    title: "Responsive Website Portfolio",
    text: "A personal portfolio website built using HTML, CSS, and JavaScript, with a Node.js backend for contact form handling. The portfolio features sections that includes an introduction, about me, skills, projects and a contact form.",
    year: "July 2025",
  },
};

function updateTimelineProgress(activeIndex) {
  const progress = (activeIndex / (yearMarkers.length - 1)) * 100;
  timelineProgress.style.width = `${progress}%`;
}

yearMarkers.forEach((marker, index) => {
  marker.addEventListener("click", (e) => {
    e.preventDefault();

    yearMarkers.forEach((m) => m.classList.remove("active"));
    marker.classList.add("active");

    updateTimelineProgress(index);

    const year = marker.getAttribute("data-year");
    const template = document.getElementById(`${year}-template`);

    if (template) {
      imageStack.classList.add("fade-out");

      setTimeout(() => {
        imageStack.innerHTML = "";
        imageStack.appendChild(template.content.cloneNode(true));
        updateStackOrder(imageStack);

        imageStack.classList.remove("fade-out");
        imageStack.classList.add("fade-in");

        setTimeout(() => {
          imageStack.classList.remove("fade-in");
        }, 400);
      }, 400);
    }

    const titleElement = document.getElementById("projectTitle");
    const textElement = document.getElementById("projectText");
    const yearElement = document.getElementById("projectYear");
    const descriptionBox = document.querySelector(".project-description");
    const info = projectInfo[year];

    if (info && titleElement && textElement && descriptionBox) {
      descriptionBox.classList.remove("fade-in");
      setTimeout(() => {
        deleteText(titleElement, 10, () => {
          typewriter(titleElement, info.title);
        });
        textElement.textContent = info.text;
        yearElement.textContent = info.year;
        descriptionBox.classList.add("fade-in");
      }, 800);
    }
  });
});

function updateStackOrder(stack) {
  const layers = Array.from(stack.children).reverse();

  layers.forEach((layer, index) => {
    let xOffset = 0,
      yOffset = 0,
      rotation = 0;

    if (index === 1) {
      xOffset = -4;
      rotation = -8;
    } else if (index === 2) {
      xOffset = 4;
      rotation = 8;
    }

    layer.style.setProperty("--x-offset", `${xOffset}vw`);
    layer.style.setProperty("--y-offset", `${yOffset}vw`);
    layer.style.setProperty("--rotation", `${rotation}deg`);
    layer.style.zIndex = layers.length - index;

    layer.onclick = () => {
      stack.appendChild(layer);
      updateStackOrder(stack);
    };
  });
}

// Set first year as active
window.addEventListener("DOMContentLoaded", () => {
  const defaultTemplate = document.getElementById("2023-template");
  if (defaultTemplate) {
    imageStack.appendChild(defaultTemplate.content.cloneNode(true));
    updateStackOrder(imageStack);

    yearMarkers[0].classList.add("active");
    updateTimelineProgress(0);

    const defaultInfo = projectInfo["2023"];
    if (defaultInfo) {
      typewriter(document.getElementById("projectTitle"), defaultInfo.title);
      document.getElementById("projectText").textContent = defaultInfo.text;
      document.getElementById("projectYear").textContent = defaultInfo.year;
      document.querySelector(".project-description").classList.add("fade-in");
    }
  }
});

//mobile nav behavior

const mobileNav = document.getElementById("mobile-bottom-nav");
const navLinks = mobileNav.querySelectorAll("a[href^='#']");
const logoLink = mobileNav.querySelector("a.logo");
const allLinks = mobileNav.querySelectorAll("a");
const sections = document.querySelectorAll("section[id]");

window.addEventListener("DOMContentLoaded", () => {
  const isAtTop = window.scrollY <= 10;

  if (isAtTop) {
    allLinks.forEach((link) => {
      link.classList.remove("active");
      link.classList.add("inactive");
    });
    logoLink.classList.add("active");
    logoLink.classList.remove("inactive");
  }
});

window.addEventListener("scroll", () => {
  let currentSectionId = "";
  const isAtTop = window.scrollY <= 10;

  // Detect current section
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSectionId = section.getAttribute("id");
    }
  });

  // Reset all links
  allLinks.forEach((link) => {
    link.classList.remove("active");
    link.classList.add("inactive");
  });

  // Set active logo at top, else active section
  if (isAtTop || currentSectionId === "") {
    logoLink?.classList.add("active");
    logoLink?.classList.remove("inactive");
  } else {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href").replace("#", "");
      if (href === currentSectionId) {
        link.classList.add("active");
        link.classList.remove("inactive");
      }
    });

    logoLink?.classList.remove("active");
    logoLink?.classList.add("inactive");
  }
});

logoLink.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
  flipCard(false);
});

//tablet active icon nav view
document.addEventListener("DOMContentLoaded", () => {
  const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1036;
  if (!isTablet) return;

  const tabletNav = document.getElementById("mobile-bottom-nav");
  if (!tabletNav) return;

  const tabletNavLinks = tabletNav.querySelectorAll("a[href^='#']");
  const tabletLogoLink = tabletNav.querySelector("a.logo");
  const tabletAllLinks = tabletNav.querySelectorAll("a");
  const tabletSections = document.querySelectorAll("section[id]");

  if (window.scrollY <= 10) {
    tabletAllLinks.forEach((link) => {
      link.classList.remove("active");
      link.classList.add("inactive");
    });

    tabletLogoLink.classList.add("active");
    tabletLogoLink.classList.remove("inactive");
  }

  window.addEventListener("scroll", () => {
    let currentTabletSection = "";

    tabletSections.forEach((section) => {
      const offset = 500;
      const top = section.offsetTop - offset;
      const height = section.offsetHeight;

      if (window.scrollY >= top && window.scrollY < top + height) {
        currentTabletSection = section.getAttribute("id");
      }
    });

    // Reset all links
    tabletAllLinks.forEach((link) => {
      link.classList.remove("active");
      link.classList.add("inactive");
    });

    if (window.scrollY <= 10) {
      // Only activate home if truly at top
      tabletLogoLink.classList.add("active");
      tabletLogoLink.classList.remove("inactive");
    } else if (currentTabletSection !== "") {
      tabletNavLinks.forEach((link) => {
        const href = link.getAttribute("href").replace("#", "");
        if (href === currentTabletSection) {
          link.classList.add("active");
          link.classList.remove("inactive");
        }
      });
    }
  });

  // Smooth scroll home click
  tabletLogoLink?.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (typeof flipCard === "function") flipCard(false);
  });
});
