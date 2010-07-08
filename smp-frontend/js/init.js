dominoes.property( "smp_js_root" , "/_static/smp/js" );

dominoes.property( "jquery" , "$(smp_js_root)/lib/jquery/jquery.js" );
dominoes.property( "jsont" , "$(smp_js_root)/lib/json-template/json-template.js" );

dominoes.rule('p.metadata','$(jquery) > $(smp_js_root)/lib/jquery/plugins/jquery.metadata.js');

dominoes.rule('smp_core','$(jquery) > $(smp_js_root)/smp.core.js');
dominoes.rule('smp_jsont','smp_core > $(jsont) > $(smp_js_root)/smp.jsont.js');
dominoes.rule('smp_service','smp_core > $(smp_js_root)/smp.service.js');
dominoes.rule('smp_pager','( smp_core smp_service smp_jsont ) > $(smp_js_root)/smp.pager.js');