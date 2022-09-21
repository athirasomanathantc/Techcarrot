! function() {

    var e = "ALG-proxy-theme-primary--bg",
        s = "ALG-proxy-theme-primary--text",
        a = "ALG-proxy-theme-dark-alt--text",
        t = "ALG-proxy-neutral-light--bdr",
        o = "ALG-proxy-neutral-lighter--bg",
        l = "ALG-proxy-neutral-lighter-alt--bg",
        r = "ALG-proxy-neutral-lighter-alt--text",
        c = "ALG-proxy-white--bg",
        m = "ALG-proxy-neutral-primary--text",
        n = "ALG-proxy-neutral-secondary--text",
        i = "ALG-proxy-theme-",
        N = {
            RIBBON: i + "site-ribbon",
            HEADER: i + "site-header",
            FOOTER: i + "site-footer",
            COMMAND_BAR: i + "command-bar",
            LOGO: i + "logo",
            SITE_INFO: i + "site-info",
            TOP_NAVIGATION: i + "top-nav",
            SIDE_NAVIGATION: i + "side-nav",
            PAGE_TITLE: i + "page-title",
            SEARCH: i + "search",
            FOLLOWERS: i + "followers",
            MEMBERS: i + "members",
            SCROLL_WRAPPER: i + "scroll-wrapper",
            SCROLL_WRAPPER_MOBILE: i + "scroll-mobile-wrapper",
            FOOTER_FIXED: i + "footer-fixed-wrapper",
            HUB_NAVIGATION: i + "hub-nav",
            TOP_SHY_NAVIGATION: i + "top-shy-nav"
        },
        p = [{
            selector: [".ms-Button--primary"],
            className: [e, "ALG-proxy-neutral-lighter--text"]
        }, {
            selector: [".ms-Button--default"],
            className: [o, m]
        }, {
            selector: [".ms-Dialog-main"],
            className: [c]
        }, {
            selector: [".ms-Dialog-subText"],
            className: [m]
        }, {
            selector: [".ms-Dialog-title"],
            className: [m]
        }, {
            selector: [".ms-Panel-main"],
            className: [c]
        }, {
            selector: [".sp-ChangeTheLookPanel-headerText"],
            className: ["ALG-proxy-black--text"]
        }, {
            selector: [".sp-ChangeTheLookPanel-section"],
            className: [m]
        }, {
            selector: [".ToolbarButton"],
            className: ["ALG-proxy-neutral-primary--bg", r]
        }, {
            selector: ['[role="banner"][class^="simpleFooterContainer"]'],
            className: [N.FOOTER]
        }, {
            selector: [".ms-CommandBar"],
            className: [N.COMMAND_BAR]
        }, {
            selector: [".ms-Button--commandBar .ms-Button-icon"],
            className: [a]
        }, {
            selector: [".ms-Button--primary .ms-Button-icon"],
            className: [r]
        }, {
            selector: [".ms-Button.ms-Button--commandBar.ms-CommandBarItem-link"],
            className: [m, o]
        }, {
            selector: ['[class*="belowHeader"] > [class*="spNav"]', "#spLeftNav"],
            className: [t, N.SIDE_NAVIGATION]
        }, {
            selector: ['[class*=".plusButton-"]'],
            className: ["ALG-proxy-neutral-tertiary--bg"]
        }, {
            selector: [".CanvasToolboxHint-plusButton"],
            className: [e]
        }, {
            selector: [".CanvasToolboxHint.ZoneHint.zone-selected"],
            className: ["ALG-proxy-theme-primary--bdr"]
        }, {
            selector: [".ms-CommandBar .ms-Button.ms-Button--action.ms-Button--command"],
            className: ["ALG-proxy-theme-lighter"]
        }, {
            selector: ['[class*="header_"]'],
            className: [o]
        }, {
            selector: [".ms-Toggle-background"],
            className: [e]
        }, {
            selector: [".ms-Toggle-thumb"],
            className: [c]
        }, {
            selector: [".emptyStatePreviewContainer, .ms-TipTile .ms-DocumentCardPreview"],
            className: [e]
        }, {
            selector: ['[class*="emptyStateIcon"'],
            className: [e]
        }, {
            selector: ['[class*="text_description_"], [class*="metadata_"] [class*="date_"]'],
            className: [n]
        }, {
            selector: ['[class*="text_title_"], [class*="metadata_"] [class*="author_"]'],
            className: [m]
        }, {
            selector: ['[class*="placeholder_description_"]'],
            className: [n]
        }, {
            selector: ['[class*="placeholder_title_text_"]'],
            className: [m]
        }, {
            selector: ['[class*="placeholder_title_icon_"]'],
            className: [s]
        }, {
            selector: ['[class*="primaryItem_"] > [class*="placeholder_"]'],
            className: [o]
        }, {
            selector: [".ms-DocumentCard.ms-DocumentCard--actionable"],
            className: [l, t]
        }, {
            selector: [".ms-DocumentCardTile .ms-DocumentCardPreview"],
            className: [o]
        }, {
            selector: [".ms-TipTile-title"],
            className: [m]
        }, {
            selector: [".ms-DocumentCardTile-titleArea > *"],
            className: [m]
        }, {
            selector: [".ms-DocumentCardActivity-activity"],
            className: [n]
        }, {
            selector: [".ms-DocumentCardActivity-name"],
            className: [m]
        }, {
            selector: ['[class*="primaryText_"]'],
            className: [m]
        }, {
            selector: ['[class*="secondaryText_"]'],
            className: [n]
        }, {
            selector: ['[class*="emptyStateCard_"]'],
            className: [l]
        }, {
            selector: ['[class*="placeholderCard_"]'],
            className: [l]
        }, {
            selector: [".ms-DocumentCard.normalCard"],
            className: [l, t]
        }, {
            selector: ['[class*="container-"]'],
            className: [l, t]
        }, {
            selector: ["#O365_NavHeader", "#SuiteNavPlaceHolder", ".__sp_dummy_suitebar"],
            className: ["ALG-proxy-ribbon-bg", N.RIBBON]
        }, {
            selector: [".commandBarWrapper"],
            className: [t]
        }, {
            selector: [".ms-CommandBar"],
            className: [o, m]
        }, {
            selector: [".ms-HorizontalNav"],
            className: [N.TOP_NAVIGATION]
        }, {
            selector: ['[class*="logoCell"]'],
            className: [N.LOGO]
        }, {
            selector: ['[class*="titleAndNavWrapper"] [class*="titleSubcell"]'],
            className: [N.SITE_INFO]
        }, {
            selector: ['[class*="pageTitle_"]', "[data-automation-id=pageHeader]"],
            className: [N.PAGE_TITLE]
        }, {
            selector: ['[class*="actionsSubcell"]'],
            className: [N.FOLLOWERS]
        }, {
            selector: [".ms-membersInfo-infoArea", ".ms-siteHeader-membersInfo"],
            className: [N.MEMBERS]
        }, {
            selector: [".ms-searchux-searchbox", ".od-TopBar-search", "#O365_SearchBoxContainer_container"],
            className: [N.SEARCH]
        }, {
            selector: ['svg[class*="ms-searchux"]'],
            className: [a]
        }, {
            selector: ['[class*="scrollRegion_"], .sp-SiteHub-content, .od-StandaloneList-content--isScrollable,.mainContent [data-is-scrollable=true]'],
            //data-automation-id="contentScrollRegion"
            className: [N.SCROLL_WRAPPER]
        }, {
            selector: ['[class*="pageLayout_"] > div > div'],
            className: [N.SCROLL_WRAPPER_MOBILE]
        }, {
            selector: [".sp-placeholder-bottom"],
            className: [N.FOOTER_FIXED]
        }, {
            selector: ["body"],
            className: [m]
        }, {
            selector: [".ms-FocusZone.ms-DetailsHeader"],
            className: [l]
        }, {
            selector: [".text_siteLink"],
            className: [s]
        }, {
            selector: ["#SuiteNavPlaceholder", "#SuiteNavWrapper"],
            className: ["od-SuiteNav"]
        }, {
            selector: [".div.ms-compositeHeader"],
            className: [m, N.HEADER]
        }, {
            selector: [".od-TopBar-header, #spSiteHeader, .ms-compositeHeader"],
            className: [N.HEADER]
        }, {
            selector: [".Files-leftNav", '[class*="belowSearchBox"] .ms-Nav'],
            className: [N.SIDE_NAVIGATION]
        }, {
            selector: [".ms-HubNav"],
            className: [N.HUB_NAVIGATION]
        }, {
            selector: ['[class*="shyHeader-"] .ms-HorizontalNav'],
            className: [N.TOP_SHY_NAVIGATION]
        }].reduce(function(s, a) {
            return a.className.forEach(function(e) {
                s[e] = s[e] || [], s[e].push(a.selector.join(", "))
            }), s
        }, {});
  
    function d() {
        Object.keys(p).forEach(function(o) {
            var e = p[o].join(", "),
                s = document.querySelectorAll(e);
            Array.prototype.forEach.call(s, function(e, s, a) {
                var t;
                t = o, e.classList.add(t)
            })
        })
        InjectFooter();
    }
  
    function InjectFooter() {
      var elementExist = document.getElementById("ALG-Footer-Id")
      if (!elementExist || elementExist.length == 0) {
          var footerElement = document.createElement("div");
          footerElement.id = "ALG-Footer-Id";
          footerElement.className = "ALG-Footer-Class";
          //var text = document.createTextNode("My Custom Footer");
          //footerElement.appendChild(text);
          var divOnPages = document.getElementsByClassName("ALG-proxy-theme-scroll-wrapper")
          if (divOnPages && divOnPages.length > 0)
              if (divOnPages[0].firstChild) {
                  divOnPages[0].firstChild.appendChild(footerElement)
              }
              //document.getElementsByClassName("ALG-proxy-theme-scroll-wrapper")[0].appendChild(footerElement);
      }
  
    }
    "complete" === document.readyState || "interactive" === document.readyState ? d() : document.addEventListener("readystatechange", function(e) {
        var s = e.target.readyState;
        "interactive" === s && d(), "complete" === s && d()
    }, !1), window.addEventListener("load", function() {
        d()
    }), document.addEventListener("ALG-push-state-changed", function() {
        var e;
        e = setTimeout(function() {
            d(), clearTimeout(e)
        }, 3e3)
    }, !1)
  }();
  