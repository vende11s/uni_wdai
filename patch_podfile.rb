podfile_path = 'ios/Podfile'
content = File.read(podfile_path)

if !content.include?("config.build_settings.delete('EXCLUDED_ARCHS')")
  hook = <<-HOOK
  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
      :ccache_enabled => ccache_enabled?(podfile_properties),
    )
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings.delete('EXCLUDED_ARCHS')
      end
    end
    installer.pods_project.build_configurations.each do |config|
      config.build_settings.delete('EXCLUDED_ARCHS')
    end
  end
HOOK
  
  content.sub!(/post_install do \|installer\|.*?end\n  end\nend/m, hook + "end\n")
  File.write(podfile_path, content)
end
