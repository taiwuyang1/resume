(function ($) {
    "use strict";
    // WOW JS
    new WOW().init();

    $(document).ready(function () {
        /*---------------------------------------------------
            mainmenu
        ----------------------------------------------------*/
        $('.mainmenu').meanmenu({
            meanMenuContainer: '.mobile-menu',
            meanScreenWidth: '1199',
        });

        $(".sidebar-toggle-btn").on("click", function () {
            $(".sidebar-wrap").addClass("sidebar-opened");
        });
        $(".sidebar-close-btn").on("click", function () {
            $(".sidebar-wrap").removeClass("sidebar-opened");
        });

        /*---------------------------------------------------
            preloader
        ----------------------------------------------------*/
        $(window).on('load', function () {
            $('.preloader').fadeOut(500);
        });

        /*---------------------------------------------------
            Scroll Area - 使用新的滚动方法
        ----------------------------------------------------*/
        $('.scroll-area').click(function(){
            if (window.scrollToPageTop) {
                window.scrollToPageTop();
            } else {
                $('html, body').animate({
                    'scrollTop' : 0,
                },700);
            }
            return false;
        });
        
        // 移除重复的滚动监听器，使用全局的那个

        /*---------------------------------------------------
            onePageNav - 禁用，使用自定义导航系统
        ----------------------------------------------------*/
        // 原来的onePageNav已被自定义导航系统替代
        console.log('OnePageNav disabled - Using custom navigation system');

        /*================================================================= 
            //ui - tabs removed as we now use vertical layout
        ==================================================================*/

        let menuToggle = document.querySelector('.menuToggle');
        if(menuToggle) {
            menuToggle.onclick = function () {
                menuToggle.classList.toggle('active');
            }
        }

        /*================================================================= 
            Animating numbers
        ==================================================================*/
        if ($.fn.counterUp) {
            $('.counter').counterUp({
                delay: 10,
                time: 3000
            });
        }

        // Removed marquee functionality as it's not needed for the new design

        // Load resume data when page is ready
        loadResumeData();
        
        // 简单直接的导航功能
        initSimpleNavigation();
    });
    
    // 回到顶部函数
    function scrollToTop() {
        $('html, body').animate({
            scrollTop: 0
        }, 700);
    }
    
    // Resume data loading and rendering functions
    let resumeData = {};

    async function loadResumeData() {
        try {
            const response = await fetch('static/js/resume.json');
            if (!response.ok) {
                throw new Error('Failed to load resume data');
            }
            resumeData = await response.json();
            renderAllSections();
        } catch (error) {
            console.error('Error loading resume data:', error);
        }
    }

    function renderAllSections() {
        renderHeader();
        renderSidebar();
        renderAbout();
        renderExperience();
        renderEducation();
        renderSkills();
        renderProjects();
        renderVolunteer();
        renderPublications();
        renderCertificates();
        renderOrganizations();
        renderFooter();
    }

    function renderHeader() {
        const personal = resumeData.personal;
        if (!personal) return;

        // Update avatar - use placeholder if not specified
        const avatarSrc = personal.avatar ? `static/picture/${personal.avatar}` : 'static/picture/placeholder.jpg';
        $('#header-avatar').attr('src', avatarSrc);
        
        // Update name and title
        $('#header-name').text(personal.name || 'Loading...');
        // Get title from the first experience entry if not in personal
        const firstJob = resumeData.experience && resumeData.experience[0];
        const title = personal.title || (firstJob ? `${firstJob.role} @ ${firstJob.company}` : 'Loading...');
        $('#header-title').text(title);
        
        // Update location
        $('#header-location span').text(personal.location || 'Loading...');
        
        // Update intro
        $('#header-intro').text(personal.intro || 'Loading...');

        // Update social links
        if (personal.contacts) {
            let socialHtml = '';
            const contacts = personal.contacts;
            
            if (contacts.google_scholar) {
                socialHtml += `<a href="${contacts.google_scholar}" target="_blank"><i class="fas fa-graduation-cap"></i></a>`;
                $('#google-scholar-link').attr('href', contacts.google_scholar);
            }
            if (contacts.linkedin) {
                socialHtml += `<a href="${contacts.linkedin}" target="_blank"><i class="fab fa-linkedin-in"></i></a>`;
            }
            if (contacts.github) {
                socialHtml += `<a href="${contacts.github}" target="_blank"><i class="fab fa-github"></i></a>`;
            }
            if (contacts.email) {
                socialHtml += `<a href="mailto:${contacts.email}"><i class="fas fa-envelope"></i></a>`;
                $('#personal-email').text(contacts.email);
            }
            
            $('#header-contacts').html(socialHtml);
        }

        // Update personal details in the unified section
        $('#personal-name').text(personal.name || 'Loading...');
        
        // Since personal.details is not in the current JSON structure,
        // use fallback values or hide these fields
        $('#personal-phone').text(personal.phone || '暂无');
        $('#personal-age').text(personal.age || '暂无');
        $('#personal-education').text(personal.education_summary || '暂无');
        $('#personal-freelance').text(personal.freelance_status || '暂无');
        
        // Update email from contacts
        if (personal.contacts && personal.contacts.email) {
            $('#personal-email').text(personal.contacts.email);
        } else {
            $('#personal-email').text('暂无');
        }
    }

    function renderSidebar() {
        const personal = resumeData.personal;
        if (!personal) return;

        $('#sidebar-location').text(personal.location || '');
        $('#sidebar-email').text(personal.contacts?.email || 'Email not available');

        // Sidebar social links
        if (personal.contacts) {
            let socialHtml = '<li><span>关注我们：</span></li>';
            if (personal.contacts.linkedin) {
                socialHtml += `<li><a href="${personal.contacts.linkedin}" target="_blank"><i class="fab fa-linkedin-in"></i></a></li>`;
            }
            if (personal.contacts.github) {
                socialHtml += `<li><a href="${personal.contacts.github}" target="_blank"><i class="fab fa-github"></i></a></li>`;
            }
            if (personal.contacts.google_scholar) {
                socialHtml += `<li><a href="${personal.contacts.google_scholar}" target="_blank"><i class="fas fa-graduation-cap"></i></a></li>`;
            }
            $('#sidebar-social').html(socialHtml);
        }
    }

    function renderAbout() {
        const personal = resumeData.personal;
        if (!personal) return;

        // Since we merged Hero and About sections, renderAbout now only handles
        // remaining content that wasn't moved to the header section.
        // Most personal info is now handled in renderHeader()
        
        // The about section now mainly contains the content sections
        // (experience, education, etc.) which are handled by their own render functions
        console.log('About section merged with header - personal data rendered in renderHeader()');
    }

        function renderExperience() {
        const experiences = resumeData.experience;
        if (!experiences || !experiences.length) return;

        let experienceHtml = '';
        
        experiences.forEach((exp, index) => {
            const isLeft = index % 2 === 0;
            const side = isLeft ? 'left' : 'right';
            const isCurrent = exp.duration && exp.duration.includes('至今');
            const currentClass = isCurrent ? ' current' : '';
            
            experienceHtml += `
                <div class="timeline-item ${side}${currentClass}">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <div class="timeline-company-info">
                                ${exp.company_logo ? `
                                    <div class="timeline-company-logo">
                                        <img src="${exp.company_logo}" alt="${exp.company}" onerror="this.style.display='none'">
                                    </div>
                                ` : ''}
                                <div class="timeline-company-details">
                                    <div class="role-header">
                                        <h3 class="timeline-company">${exp.company}</h3>
                                    </div>
                                    
                                    ${exp.location ? `
                                        <div class="timeline-location">
                                            <i class="fas fa-map-marker-alt"></i>
                                            <span>${exp.location}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>

                        
                        
                        ${exp.roles && exp.roles.length > 0 ? `
                            <div class="timeline-roles">
                                ${exp.roles.map(role => `
                                    <div class="role-item">
                                        <div class="role-header">
                                            <h3 class="timeline-company">${role.title}</h3>
                                            <div class="role-type">${role.type}</div>
                                        </div>
                                        <div class="role-duration">
                                            <i class="fas fa-clock"></i>
                                            <span>${role.duration}</span>
                                        </div>
                                        <div class="role-description">
                                            ${role.description ? role.description.map(item => `<div class="role-bullet">• ${item}</div>`).join('') : ''}
                                        </div>
                                        ${role.highlights && role.highlights.length > 0 ? `
                                            <div class="role-highlights">
                                                ${role.highlights.map(highlight => `
                                                    <div class="role-highlight">
                                                        ${highlight.image ? `
                                                            <div class="highlight-image">
                                                                <img src="${highlight.image}" alt="${highlight.title}" onerror="this.style.display='none'">
                                                            </div>
                                                        ` : '<i class="fas fa-file-alt"></i>'}
                                                        <div class="highlight-content">
                                                            <span class="highlight-title">${highlight.title}</span>
                                                            ${highlight.type ? `<span class="highlight-type">${highlight.type}</span>` : ''}
                                                        </div>
                                                        ${highlight.url ? `<a href="${highlight.url}" target="_blank" class="highlight-link"><i class="fas fa-external-link-alt"></i></a>` : ''}
                                                    </div>
                                                `).join('')}
                                            </div>
                                        ` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                        <div class="timeline-roles">
                            <div class="role-item">
                                <div class="role-header">
                                    <h3 class="timeline-company">${exp.title}</h3>
                                    ${exp.type ? `
                                        <div class="role-type">${exp.type}</div>
                                    ` : ''}
                                </div>
                                <div class="role-duration">
                                    <i class="fas fa-clock"></i>
                                    <span>${exp.duration}</span>
                                </div>
                                ${exp.description_title ? `
                                    <div class="timeline-description-title">
                                        <span>${exp.description_title}</span>
                                    </div>
                                ` : ''}
                                <div class="role-description">
                                    ${exp.description ? exp.description.map(item => `<div class="role-bullet">• ${item}</div>`).join('') : ''}
                                </div>
                                ${exp.highlights && exp.highlights.length > 0 ? `
                                    <div class="role-highlights">
                                        ${exp.highlights.map(highlight => `
                                            <div class="role-highlight">
                                                ${highlight.image ? `
                                                    <div class="highlight-image">
                                                        <img src="${highlight.image}" alt="${highlight.title}" onerror="this.style.display='none'">
                                                    </div>
                                                ` : '<i class="fas fa-file-alt"></i>'}
                                                <div class="highlight-content">
                                                    <span class="highlight-title">${highlight.title}</span>
                                                    ${highlight.type ? `<span class="highlight-type">${highlight.type}</span>` : ''}
                                                </div>
                                                ${highlight.url ? `<a href="${highlight.url}" target="_blank" class="highlight-link"><i class="fas fa-external-link-alt"></i></a>` : ''}
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>

                        `}
                        
                       
                    </div>
                </div>
            `;
        });
        
        $('#experience-timeline').html(experienceHtml);
    }

    function renderEducation() {
        const education = resumeData.education;
        if (!education || !education.length) return;

        // Generate horizontal card layout (流程图样式)
        let horizontalHtml = '';
        
        education.forEach((edu, index) => {
            const isCurrent = edu.duration.includes('至今') || edu.duration.includes('预计');
            const currentClass = isCurrent ? ' education-timeline-current' : '';
            
            horizontalHtml += `
                <div class="education-timeline-item-horizontal${currentClass}">
                    <div class="education-timeline-card-horizontal">
                        <div class="education-timeline-header">
                            ${edu.school_logo ? `
                                <div class="education-timeline-logo">
                                    <img src="${edu.school_logo}" alt="${edu.school}" onerror="this.style.display='none'">
                                </div>
                            ` : ''}
                            <div class="education-timeline-info">
                                <h4 class="education-timeline-school">${edu.school}</h4>
                                <div class="education-timeline-degree">${edu.degree}</div>
                                <div class="education-timeline-period">${edu.duration}</div>
                            </div>
                        </div>
                        
                        ${edu.notes && edu.notes.length > 0 ? `
                            <div class="education-timeline-notes">
                                ${edu.notes.map(note => `<div class="education-note">${note}</div>`).join('')}
                            </div>
                        ` : ''}
                        
                        ${edu.highlights && edu.highlights.length > 0 ? `
                            <div class="education-timeline-highlights">
                                ${edu.highlights.map(highlight => `
                                    <div class="education-highlight">
                                        <div class="highlight-content">
                                            ${highlight.image ? `
                                                <div class="highlight-image">
                                                    <img src="${highlight.image}" alt="${highlight.title}" onerror="this.style.display='none'">
                                                </div>
                                            ` : ''}
                                            <div class="highlight-title">${highlight.title}</div>
                                            ${highlight.url ? `
                                                <a href="${highlight.url}" target="_blank" class="highlight-link">
                                                    <i class="fas fa-external-link-alt"></i>
                                                </a>
                                            ` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        $('#education-timeline-horizontal2').html(horizontalHtml);
    }

    function renderSkills() {
        const skills = resumeData.skills;
        if (!skills || !skills.length) return;

        let skillsHtml = '';
        
        skills.forEach((skill, index) => {
            // 根据索引选择对应的图片
            const imageIndex = (index % 3) + 1;
            const imagePath = `static/image/${imageIndex}.png`;
            
            // 根据技能名称判断类别
            let category = '技术技能';
            if (skill.toLowerCase().includes('python') || skill.toLowerCase().includes('java') || 
                skill.toLowerCase().includes('javascript') || skill.toLowerCase().includes('c++') ||
                skill.toLowerCase().includes('sql') || skill.toLowerCase().includes('html') ||
                skill.toLowerCase().includes('css') || skill.toLowerCase().includes('react') ||
                skill.toLowerCase().includes('vue') || skill.toLowerCase().includes('node')) {
                category = '编程语言';
            } else if (skill.toLowerCase().includes('ai') || skill.toLowerCase().includes('机器学习') ||
                       skill.toLowerCase().includes('深度学习') || skill.toLowerCase().includes('神经网络') ||
                       skill.toLowerCase().includes('tensorflow') || skill.toLowerCase().includes('pytorch')) {
                category = '人工智能';
            } else if (skill.toLowerCase().includes('项目管理') || skill.toLowerCase().includes('团队协作') ||
                       skill.toLowerCase().includes('沟通') || skill.toLowerCase().includes('领导力')) {
                category = '软技能';
            }
            
            skillsHtml += `
                <div class="skill-card">
                    <div class="skill-image" style="background-image: url('${imagePath}')"></div>
                    <div class="skill-content">
                        <h3 class="skill-name">${skill}</h3>
                    </div>
                </div>
            `;
        });
        
        $('#skills-tags').html(skillsHtml);
    }

    function renderProjects() {
        const projects = resumeData.projects;
        if (!projects || !projects.length) return;

        let projectsHtml = '';
        projects.forEach((project, index) => {
            projectsHtml += `
                <div class="project-card">
                    <div class="project-header">
                        <div class="project-company-info">
                            <div class="project-company-details">
                                <h3 class="project-company">${project.title} 
                                    ${project.company ? `
                                        <span style="font-size: 1rem; color: #4ecdc4;">
                                            @${project.company}
                                        </span>
                                    ` : ''}
                                </h3>
                            </div>
                        </div>
                        
                    </div>
                    <div class="project-body">
                        ${project.duration ? `
                            <div class="project-period">
                                <i class="fas fa-clock"></i>
                                <span>${project.duration}</span>
                            </div>
                        ` : ''}
                        ${project.affiliation ? `
                            <div class="project-affiliation">
                                <div class="affiliation-info">
                                    ${project.affiliation_logo ? `
                                        <div class="affiliation-logo">
                                            <img src="${project.affiliation_logo}" alt="affiliation" onerror="this.style.display='none'">
                                        </div>
                                    ` : ''}
                                    <span>${project.affiliation}</span>
                                </div>
                            </div>
                        ` : ''}
                        ${project.description && project.description.length > 0 ? `
                            <div class="project-description">
                                ${project.description.map(item => `<div class="project-bullet">${item}</div>`).join('')}
                            </div>
                        ` : ''}
                        ${project.highlights && project.highlights.length > 0 ? `
                            <div class="project-highlights">
                                ${project.highlights.map(highlight => `
                                    <div class="project-highlight">
                                        ${highlight.image ? `
                                            <div class="highlight-image">
                                                <img src="${highlight.image}" alt="${highlight.title}" onerror="this.style.display='none'">
                                            </div>
                                        ` : ''}
                                        <div class="highlight-content">
                                            <div class="highlight-title">${highlight.title}</div>
                                            ${highlight.subtitle ? `<div class="highlight-subtitle">${highlight.subtitle}</div>` : ''}
                                        </div>
                                        ${highlight.link ? `<a href="${highlight.link}" target="_blank" class="highlight-link"><i class="fas fa-external-link-alt"></i></a>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        ${project.links && project.links.length > 0 ? `
                            <div class="project-links">
                                ${project.links.map((link, linkIndex) => `
                                    <a href="${link}" target="_blank" class="project-link">
                                        ${linkIndex === 0 ? '<i class="fab fa-github"></i> GitHub' : '<i class="fas fa-external-link-alt"></i> 访问项目'}
                                    </a>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        $('#projects-grid').html(projectsHtml);
    }

    function renderVolunteer() {
        const volunteer = resumeData.volunteer;
        if (!volunteer || !volunteer.length) return;

        // Render volunteer as service items
        let volunteerHtml = '';
        volunteer.slice(0, 4).forEach((vol, index) => {
            volunteerHtml += `
                <div class="col-md-6 col-sm-6 mb-4">
                    <div class="single-service">
                        <div class="single-service-img">
                            <i class="fas fa-hands-helping text-primary"></i>
                        </div>
                        <div class="service-content">
                            <h6>${vol.org}</h6>
                            <p class="text-primary">${vol.role}</p>
                            <p class="text-muted">${vol.period}</p>
                        </div>
                    </div>
                </div>
            `;
        });

        $('#volunteer-list').html(volunteerHtml);
    }

    function renderPublications() {
        const publications = resumeData.publications;
        if (!publications || !publications.length) return;

        let pubsHtml = '';
        publications.forEach((pub, index) => {
            const descriptionText = pub.description && pub.description.length > 0 ? 
                pub.description.map(desc => `<p>${desc}</p>`).join('') : 
                '<p>暂无描述</p>';
            
            // 检查描述是否较长，需要展开收起功能
            const hasLongDescription = pub.description && pub.description.length > 0 && 
                (pub.description.join('').length > 400 || pub.description.length > 2);
            
            pubsHtml += `
                <div class="publication-card">
                    <div class="publication-header">
                        <div class="publication-info">
                            <h3 class="publication-title">${pub.title}</h3>
                            <div class="publication-year">
                                <i class="fas fa-calendar-alt"></i>
                                <span>${pub.year}</span>
                            </div>
                        </div>
                    </div>
                    <div class="publication-body">
                        <div class="publication-description ${hasLongDescription ? 'collapsed' : ''}" id="pub-desc-${index}">
                            ${descriptionText}
                        </div>
                        <div class="publication-actions" style="display: flex;align-items: center;">
                        ${hasLongDescription ? `
                            <button class="publication-toggle-btn" onclick="togglePublicationDescription(${index})">
                                <i class="fas fa-chevron-down"></i>
                                <span>展开详情</span>
                            </button>
                        ` : ''}
                        ${pub.links ? `
                            <div class="publication-links">
                                <a href="${pub.links}" target="_blank" class="publication-link">
                                    <i class="fas fa-external-link-alt"></i>
                                    <span>查看</span>
                                </a>
                            </div>
                        ` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        $('#publications-container').html(pubsHtml);
    }

    function renderCertificates() {
        const certificates = resumeData.certificates;
        if (!certificates || !certificates.length) return;

        let certsHtml = '';
        certificates.forEach((cert, index) => {
            certsHtml += `
                <div class="certificate-card">
                    <div class="certificate-header">
                        <div class="certificate-logo">
                            <img src="${cert.certificate_logo}" alt="${cert.issuer}" onerror="this.style.display='none'">
                        </div>
                        
                        <div class="certificate-info">
                            <h3 class="certificate-title">${cert.title}</h3>
                            <div class="certificate-issuer">${cert.issuer}</div>
                        </div>
                        <div class="certificate-type">${cert.type === 'certificates' ? '资格认证' : '荣誉奖项'}</div>
                    </div>
                    
                    <div class="certificate-body">
                        <div class="certificate-date">
                            <i class="fas fa-clock"></i>
                            <span>${cert.date}</span>
                        </div>
                        
                        ${cert.credential_id ? `
                            <div class="certificate-id">
                                <i class="fas fa-id-card"></i>
                                <span>ID: ${cert.credential_id}</span>
                            </div>
                        ` : ''}
                        
                        ${cert.affiliation ? `
                            <div class="certificate-affiliation">
                                <i class="fas fa-university"></i>
                                <span>${cert.affiliation}</span>
                            </div>
                        ` : ''}
                        
                        ${cert.description && cert.description.length > 0 ? `
                            <div class="certificate-description">
                                ${cert.description.map(desc => `<div class="desc-item">${desc}</div>`).join('')}
                            </div>
                        ` : ''}
                        
                        ${cert.highlights && cert.highlights.length > 0 ? `
                            <div class="certificate-highlights">
                                ${cert.highlights.map(highlight => `
                                    <div class="highlight-item">
                                        ${highlight.image ? `
                                            <div class="highlight-image">
                                                <img src="${highlight.image}" alt="${highlight.title}" onerror="this.style.display='none'">
                                            </div>
                                        ` : ''}
                                        <div class="highlight-content">
                                            <div class="highlight-title">${highlight.title}</div>
                                            ${highlight.description ? `<div class="highlight-description">${highlight.description}</div>` : ''}
                                            ${highlight.url ? `
                                                <a href="${highlight.url}" target="_blank" class="highlight-link">
                                                    <i class="fas fa-external-link-alt"></i>
                                                    查看详情
                                                </a>
                                            ` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        $('#certificates-grid').html(certsHtml);
    }

    function renderOrganizations() {
        const organizations = resumeData.organizations;
        if (!organizations || !organizations.length) return;

        let orgsHtml = '';
        organizations.forEach((org, index) => {
            // For simple string organizations, create logo from first letter
            if (typeof org === 'string') {
                const firstLetter = org.charAt(0).toUpperCase();
                orgsHtml += `
                    <div class="organization-item">
                        <div class="organization-logo">
                            ${firstLetter}
                        </div>
                        <div class="organization-name">${org}</div>
                    </div>
                `;
            } else {
                // For object organizations with more details
                const firstLetter = org.name ? org.name.charAt(0).toUpperCase() : 'O';
                orgsHtml += `
                    <div class="organization-item">
                        <div class="organization-logo">
                            ${org.logo || firstLetter}
                        </div>
                        <div class="organization-name">${org.name || org}</div>
                        ${org.type ? `<div class="organization-type">${org.type}</div>` : ''}
                    </div>
                `;
            }
        });

        $('#organizations-cloud').html(orgsHtml);
    }

    function renderFooter() {
        const personal = resumeData.personal;
        if (!personal) return;

        $('#footer-name').text(personal.location || '地址信息');
        if (personal.contacts && personal.contacts.email) {
            $('#footer-contacts').attr('href', `mailto:${personal.contacts.email}`).text(personal.contacts.email);
        }
    }

    // Make functions available globally
    window.loadResumeData = loadResumeData;
    window.togglePublicationDescription = togglePublicationDescription;
    
    // Publication description toggle function
    function togglePublicationDescription(index) {
        const descriptionElement = document.getElementById(`pub-desc-${index}`);
        const toggleButton = descriptionElement.nextElementSibling;
        const isCollapsed = descriptionElement.classList.contains('collapsed');
        
        if (isCollapsed) {
            // Expand
            descriptionElement.classList.remove('collapsed');
            toggleButton.classList.add('expanded');
            toggleButton.querySelector('span').textContent = '收起详情';
        } else {
            // Collapse
            descriptionElement.classList.add('collapsed');
            toggleButton.classList.remove('expanded');
            toggleButton.querySelector('span').textContent = '展开详情';
        }
    }

}(jQuery));

function menuclick12(){
    $(".sidebar-wrap").removeClass("sidebar-opened");
}

// ========== 全新的导航功能实现 ==========
/**
 * 自定义导航系统 - 完全重写版本
 */
function initCustomNavigation() {
    const NAV_CONFIG = {
        headerSelector: '#header-area',
        navLinksSelector: '#nav_header a',
        scrollTopButtonSelector: '.scroll-area',
        stickyThreshold: 100,
        scrollTopThreshold: 400,
        sectionOffset: 120,
        animationDuration: 800,
        activeClassName: 'active',
        stickyClassName: 'sticky',
        sections: [
            'home', 'about', 'work-experience', 'qualification-authentication', 
            'skill', 'educational', 'my-projects', 'publications-container'
        ]
    };

    // 导航状态管理
    let currentActiveSection = '';
    let isScrolling = false;
    let scrollTimer = null;

    // 初始化导航功能
    function initNavSystem() {
        setupScrollMonitor();
        setupSmoothScrolling();
        updateInitialState();
        console.log('Custom Navigation System Initialized');
    }

    // 设置滚动监听
    function setupScrollMonitor() {
        $(window).off('scroll.customNav');
        
        // 使用原生JavaScript添加passive滚动监听器
        window.addEventListener('scroll', function() {
            if (scrollTimer) clearTimeout(scrollTimer);
            
            handleScrollEffects();
            
            scrollTimer = setTimeout(function() {
                isScrolling = false;
            }, 100);
        }, { passive: true });
    }

    // 处理滚动效果
    function handleScrollEffects() {
        const scrollPosition = $(window).scrollTop();
        
        // 处理导航栏固定
        toggleHeaderFixed(scrollPosition);
        
        // 处理回到顶部按钮
        toggleScrollTopButton(scrollPosition);
        
        // 处理导航高亮
        updateNavigationHighlight(scrollPosition);
    }

    // 切换导航栏固定状态
    function toggleHeaderFixed(scrollPos) {
        const $header = $(NAV_CONFIG.headerSelector);
        const shouldBeFixed = scrollPos >= NAV_CONFIG.stickyThreshold;
        
        if (shouldBeFixed) {
            if (!$header.hasClass(NAV_CONFIG.stickyClassName)) {
                $header.addClass(NAV_CONFIG.stickyClassName);
                console.log('✅ Header fixed at scroll:', scrollPos, 'Classes:', $header.attr('class'));
                
                // 强制应用样式
                $header.css({
                    'position': 'fixed',
                    'top': '0',
                    'z-index': '9999',
                    'width': '100%',
                    'background-color': 'rgba(22, 22, 22, 0.95)',
                    'backdrop-filter': 'blur(10px)',
                    'box-shadow': '0 0 30px rgba(0, 0, 0, 0.3)'
                });
            }
        } else {
            if ($header.hasClass(NAV_CONFIG.stickyClassName)) {
                $header.removeClass(NAV_CONFIG.stickyClassName);
                console.log('❌ Header unfixed at scroll:', scrollPos);
                
                // 移除强制样式，恢复原始样式
                $header.css({
                    'position': '',
                    'top': '',
                    'z-index': '',
                    'width': '',
                    'background-color': '',
                    'backdrop-filter': '',
                    'box-shadow': ''
                });
            }
        }
    }

    // 切换回到顶部按钮显示
    function toggleScrollTopButton(scrollPos) {
        const $scrollBtn = $(NAV_CONFIG.scrollTopButtonSelector);
        
        if (scrollPos > NAV_CONFIG.scrollTopThreshold) {
            $scrollBtn.fadeIn(300);
        } else {
            $scrollBtn.fadeOut(200);
        }
    }

    // 更新导航高亮
    function updateNavigationHighlight(scrollPos) {
        const activeSection = findActiveSection(scrollPos);
        
        if (activeSection !== currentActiveSection) {
            clearAllHighlights();
            setActiveHighlight(activeSection);
            currentActiveSection = activeSection;
            console.log('Active section changed to:', activeSection);
        }
    }

    // 查找当前活动的section
    function findActiveSection(scrollPos) {
        let activeSection = '';
        const viewportHeight = $(window).height();
        
        // 如果在页面顶部，默认高亮首页
        if (scrollPos < 200) {
            return 'home';
        }
        
        // 遍历所有sections寻找当前可见的
        for (let i = 0; i < NAV_CONFIG.sections.length; i++) {
            const sectionId = NAV_CONFIG.sections[i];
            const $section = $('#' + sectionId);
            
            if ($section.length > 0) {
                const sectionTop = $section.offset().top - NAV_CONFIG.sectionOffset;
                const sectionBottom = sectionTop + $section.outerHeight();
                
                // 检查section是否在视口中
                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    activeSection = sectionId;
                    break;
                }
                
                // 如果滚动位置在section范围内的中间部分，优先选择
                const sectionMiddle = sectionTop + ($section.outerHeight() / 2);
                if (scrollPos >= sectionTop && scrollPos <= sectionMiddle + 100) {
                    activeSection = sectionId;
                }
            }
        }
        
        return activeSection;
    }

    // 清除所有高亮
    function clearAllHighlights() {
        $(NAV_CONFIG.navLinksSelector).each(function() {
            $(this).removeClass(NAV_CONFIG.activeClassName);
            $(this).parent().removeClass('current');
        });
    }

    // 设置活动高亮
    function setActiveHighlight(sectionId) {
        if (sectionId) {
            const $targetLink = $(NAV_CONFIG.navLinksSelector + '[href="#' + sectionId + '"]');
            if ($targetLink.length > 0) {
                // 使用原有的CSS类
                $targetLink.addClass(NAV_CONFIG.activeClassName);
                $targetLink.parent().addClass('current');
                
                console.log('🔥 Highlighted section:', sectionId, 'Link text:', $targetLink.text(), 'Has active class:', $targetLink.hasClass('active'));
            } else {
                console.warn('⚠️ Target link not found for section:', sectionId);
            }
        }
    }

    // 设置平滑滚动
    function setupSmoothScrolling() {
        $(NAV_CONFIG.navLinksSelector).off('click.customNav').on('click.customNav', function(e) {
            e.preventDefault();
            
            const targetId = $(this).attr('href');
            if (targetId && targetId.startsWith('#')) {
                const $target = $(targetId);
                if ($target.length > 0) {
                    performSmoothScroll($target);
                }
            }
        });
    }

    // 执行平滑滚动
    function performSmoothScroll($target) {
        const targetTop = $target.offset().top - NAV_CONFIG.sectionOffset;
        
        $('html, body').stop().animate({
            scrollTop: targetTop
        }, NAV_CONFIG.animationDuration, 'swing', function() {
            // 滚动完成后的回调
            console.log('Scrolled to:', $target.attr('id'));
        });
    }

    // 更新初始状态
    function updateInitialState() {
        const initialScrollPos = $(window).scrollTop();
        handleScrollEffects();
    }

    // 公共方法：手动滚动到顶部
    window.scrollToPageTop = function() {
        $('html, body').stop().animate({
            scrollTop: 0
        }, NAV_CONFIG.animationDuration, 'swing');
    };

    // 公共方法：手动更新导航
    window.refreshNavigation = function() {
        const currentScrollPos = $(window).scrollTop();
        handleScrollEffects();
    };

    // 启动导航系统
    initNavSystem();
}

// 添加对应的CSS类和调试功能
$(document).ready(function() {
    // 添加自定义样式到head
    if (!$('#custom-nav-styles').length) {
        $('<style id="custom-nav-styles">')
            .text(`
                /* 导航固定样式 */
                #header-area.sticky, 
                .header-area.sticky {
                    position: fixed !important;
                    top: 0 !important;
                    z-index: 9999 !important;
                    width: 100% !important;
                    background-color: rgba(22, 22, 22, 0.95) !important;
                    backdrop-filter: blur(10px) !important;
                    -webkit-backdrop-filter: blur(10px) !important;
                    transition: all 0.5s ease !important;
                    box-shadow: 0 0 30px rgba(0, 0, 0, 0.3) !important;
                }
                
                /* 导航高亮样式 - 使用原有CSS选择器 */
                .main-menu-area ul li a.active,
                #nav_header a.active,
                #nav_header li.current a {
                    color: #FF630E !important;
                    font-weight: 600 !important;
                    text-decoration: none !important;
                }
                
                /* 确保导航链接的默认颜色 */
                #nav_header a {
                    color: #ffffff !important;
                    transition: color 0.3s ease !important;
                }
                
                /* hover效果 */
                #nav_header a:hover {
                    color: #FF630E !important;
                }
                
                /* 调试样式 */
                .debug-highlight {
                    background-color: red !important;
                    color: white !important;
                }
            `)
            .appendTo('head');
        
        console.log('Custom navigation styles added');
    }
    
    // 添加调试功能
    window.debugNavigation = function() {
        console.log('=== Navigation Debug Info ===');
        console.log('Header element:', $('#header-area')[0]);
        console.log('Header classes:', $('#header-area').attr('class'));
        console.log('Nav links:', $('#nav_header a').length);
        console.log('Current active:', $('#nav_header .active, #nav_header .current').length);
        
        // 显示所有导航链接的详细信息
        $('#nav_header a').each(function(index) {
            console.log(`Link ${index}:`, $(this).text(), 'href:', $(this).attr('href'), 'classes:', $(this).attr('class'));
        });
        
        // 临时高亮所有导航链接
        $('#nav_header a').addClass('debug-highlight');
        setTimeout(() => {
            $('#nav_header a').removeClass('debug-highlight');
        }, 2000);
    };
    
    // 测试高亮功能
    window.testHighlight = function(sectionId) {
        console.log('Testing highlight for:', sectionId);
        const $link = $('#nav_header a[href="#' + sectionId + '"]');
        console.log('Found link:', $link[0]);
        
        // 清除所有高亮
        $('#nav_header a').removeClass('active');
        $('#nav_header li').removeClass('current');
        
        // 设置高亮
        $link.addClass('active');
        $link.parent().addClass('current');
        
        console.log('After highlight - Link classes:', $link.attr('class'));
        console.log('After highlight - Li classes:', $link.parent().attr('class'));
    };
});

// ========== 超级简单的导航实现 ==========
function initSimpleNavigation() {
    console.log('🚀 Simple Navigation Starting...');
    
    // 移除可能冲突的类
    $('#header-area').removeClass('fixed');
    console.log('Removed conflicting "fixed" class');
    
    // 确保页面可以滚动
    $('html, body').css({
        'overflow-y': 'auto',
        'height': 'auto',
        'max-height': 'none'
    });
    console.log('Fixed scroll settings for html and body');
    
    // 立即应用样式 - 使用更强的选择器
    $('<style id="super-sticky-styles">')
        .text(`
            /* 超强优先级的sticky样式 */
            html body #header-area.nav-sticky-simple,
            html body .header-area.nav-sticky-simple,
            header#header-area.nav-sticky-simple {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                width: 100% !important;
                z-index: 99999 !important;
                background: rgba(22, 22, 22, 0.95) !important;
                background-color: rgba(22, 22, 22, 0.95) !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
                box-shadow: 0 2px 20px rgba(0,0,0,0.3) !important;
                transition: all 0.3s ease !important;
                margin: 0 !important;
                padding: 0rem 0 !important;
            }
            
            /* 高亮样式 */
            #nav_header a.nav-highlight-simple {
                color: #FF630E !important;
                font-weight: bold !important;
            }
            
            /* 正式的深色sticky样式 */
            .nav-sticky-simple {
                background: rgba(0, 0, 0, 0.95) !important;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3) !important;
            }
        `)
        .appendTo('head');
    
    // 多种方式监听滚动事件
    let isSticky = false;
    let lastScrollTop = 0;
    
    // 方法1: jQuery window scroll
    $(window).on('scroll.stickyNav', function() {
        handleScroll('jQuery');
    });
    
    // 方法2: 原生JavaScript scroll
    window.addEventListener('scroll', function() {
        handleScroll('Native');
    }, { passive: true });
    
    // 方法3: document scroll
    $(document).on('scroll.stickyNav', function() {
        handleScroll('Document');
    });
    
    // 方法4: 鼠标滚轮事件作为备选
    $(window).on('mousewheel wheel DOMMouseScroll', function(e) {
        setTimeout(() => {
            handleScroll('MouseWheel');
        }, 10);
    });
    
    // 方法5: 触摸事件作为备选
    $(window).on('touchmove', function(e) {
        setTimeout(() => {
            handleScroll('TouchMove');
        }, 10);
    });
    
    // 方法6: 定时器检查滚动位置变化
    setInterval(function() {
        const currentScrollTop = $(window).scrollTop();
        if (currentScrollTop !== lastScrollTop) {
            handleScroll('Timer');
            lastScrollTop = currentScrollTop;
        }
    }, 100);
    
    function handleScroll(source) {
        const scrollTop = $(window).scrollTop();
        const $header = $('#header-area');
        
        // 处理sticky导航
        if (scrollTop > 100) {
            if (!isSticky) {
                $header.addClass('nav-sticky-simple');
                isSticky = true;
            }
        } else {
            if (isSticky) {
                $header.removeClass('nav-sticky-simple');
                isSticky = false;
            }
        }
        
        // 导航高亮
        updateSimpleHighlight(scrollTop);
        
        // 回到顶部按钮
        if (scrollTop > 400) {
            $('.scroll-area').fadeIn();
        } else {
            $('.scroll-area').fadeOut();
        }
    };
    
    // 平滑滚动
    $('#nav_header a').click(function(e) {
        e.preventDefault();
        const target = $(this).attr('href');
        if (target && target.startsWith('#')) {
            const $target = $(target);
            if ($target.length) {
                $('html, body').animate({
                    scrollTop: $target.offset().top - 100
                }, 800);
            }
        }
    });
    
}

// 简单高亮更新
function updateSimpleHighlight(scrollTop) {
    const sections = ['home', 'about', 'work-experience', 'qualification-authentication', 'skill', 'educational', 'testimonial', 'my-projects', 'publications'];
    let current = '';
    
    // 页面顶部默认首页
    if (scrollTop < 200) {
        current = 'home';
    } else {
        // 查找当前section
        sections.forEach(sectionId => {
            const $section = $('#' + sectionId);
            if ($section.length) {
                const sectionTop = $section.offset().top - 150;
                const sectionBottom = sectionTop + $section.outerHeight();
                if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                    current = sectionId;
                }
            }
        });
    }
    
    // 更新高亮
    $('#nav_header a').removeClass('nav-highlight-simple');
    if (current) {
        $('#nav_header a[href="#' + current + '"]').addClass('nav-highlight-simple');
    }
}








